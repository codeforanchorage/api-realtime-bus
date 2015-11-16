library(lubridate)
library(dplyr)
library(XML)
library(stringr)
library(RProtoBuf)

base_dir <- "/home/ht/Desktop/git/api-realtime-bus/"

readProtoFiles(paste0(base_dir, "gtfs-realtime.proto"))
stops <- read.csv(paste0(base_dir, "R/gtfs/stop_times.txt"), stringsAsFactors = FALSE)

#stops$departure_time <- as.numeric(gsub(":", "", gsub("00", "", stops$departure_time)))
stops <-cbind(as.data.frame(str_split_fixed(stops$trip_id, "-", 4),
                               stringsAsFactors = FALSE), 
              as.character(hms(stops$departure_time)),
              stops$stop_sequence,
              as.character(stops$trip_id),
              as.character(stops$stop_id))
colnames(stops) <- c("routeID", "departure_time", "direction", 
                     "service_id", "stop_time", "sequence", "trip_id", "id")
stops$id  <- as.character(stops$id)
stops$service_id  <- as.numeric(stops$service_id)

#get delay infomation
stop_departures <- xmlToList(xmlParse(paste0(base_dir, "api-realtime-bus/stopdepartures.xml")))
#stop_departures <- xmlToList(xmlParse("http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml")) 

#use this function for parsing 
removenulls <- function(x) {ifelse(is.null(x), NA, x)}

today_now <- Sys.time()

if(yday(today_now) == 365) {
    service_id <- 91
  } else if(wday(today_now) == 1) {
    service_id <- 3
  } else if(wday(today_now) == 7 ) {
    service_id <- 2
  } else {
    service_id <- 1
  }
#write delay table
delays <- data.frame(
  id = as.character(unlist(lapply(stop_departures[-1], function(x) x[[1]]))),
  routeID = unlist(lapply(stop_departures[-1], function(x) x[[3]][[5]][[1]])), 
  direction = unlist(lapply(stop_departures[-1], function(x) x[[3]][[6]])),
  dev = unlist(lapply(lapply(stop_departures[-1], function(x) x[[3]][[3]]), removenulls)),
  edt = unlist(lapply(stop_departures[-1], function(x) x[[3]][[1]])),
  sdt = as.character(hm(unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]])))),
  text = unlist(lapply(stop_departures[-1], function(x) x[[3]][[4]])),
  stop_time = unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]])),
  service_id = service_id,
  stringsAsFactors = FALSE)


delays %>% filter(stop_time != "Done")

combined_data <- inner_join(delays, stops, by = c("routeID", "sdt" = "stop_time", "direction", "service_id")) %>% 
  select(trip_id, dev, sequence, text) %>% 
  filter(dev > 0) %>% 
  arrange(trip_id) %>% 
  group_by(trip_id, dev, text) %>% 
  mutate(foo = min(sequence)) %>%
  filter(foo == sequence) %>%
  unique() %>% select(-foo)

           
data_for_protobuf <- data_for_protobuf <- combined_data

current_trips <- combined_data$trip_id

protobuf_list <- vector(mode = "list", length = length(current_trips))

for(i in 1:length(current_trips)) {
  
   deviation <- data_for_protobuf %>% filter(trip_id == current_trips[i]) 
   stop_time_update_list <- vector(mode = "list", length = dim(deviation)[1])
   
  for(j in 1:dim(deviation)[1]) { 
   
  entity_id <- as.character(deviation$trip_id[j])
  n_seconds_delay <- as.numeric(deviation$dev[j])
  stop_sequence_number <- deviation$sequence[j]
  trip_id <- as.character(deviation$trip_id[j])
  
    
  stop_time_update_object <- new(transit_realtime.TripUpdate.StopTimeUpdate,
                                 stop_sequence = stop_sequence_number,
                                 arrival = new(transit_realtime.TripUpdate.StopTimeEvent,
                                               delay = n_seconds_delay)
  )
  
  stop_time_update_list[j] <- stop_time_update_object
  
  }
  
  e <- new(transit_realtime.FeedEntity,
           id = entity_id,
           trip_update = new(transit_realtime.TripUpdate,
                             trip = new(transit_realtime.TripDescriptor,
                                        trip_id = entity_id),
                             stop_time_update = stop_time_update_list
           )
  )
           
  protobuf_list[i] <- e
}

header_object <- new(transit_realtime.FeedHeader,
                     gtfs_realtime_version = "1.0",
                     incrementality = "FULL_DATASET",
                     timestamp = as.numeric(as.POSIXlt(Sys.time(), "AKST")))

m <- new(transit_realtime.FeedMessage,
         header = header_object,
         entity = protobuf_list) # use entity_list

writeLines(as.character(m))
serialize(m, paste0(base_dir, "people_mover.pb"))
