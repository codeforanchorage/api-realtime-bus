#use this function for parsing 
options(stringsAsFactors = FALSE)
removenulls <- function(x) {ifelse(is.null(x), NA, x)}
library(lubridate)
library(dplyr)
library(XML)
library(stringr)
library(RProtoBuf)

base_dir <- "/home/ubuntu/api-realtime-bus/"
#base_dir <- "/home/ht/git/api-realtime-bus/"

#get delay infomation
#stop_departures <- xmlToList(xmlParse(paste0(base_dir, "api-realtime-bus/stopdepartures.xml")))
stop_departures <- xmlToList(xmlParse("http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml")) 
#directory to write to 
# write_dir <- "/usr/share/nginx/html/"
write_dir <- "/var/www/html/"
#write_dir <- base_dir

readProtoFiles(paste0(base_dir, "gtfs-realtime.proto"))

stops <- read.csv(paste0(base_dir, "R/gtfs/stop_times.txt"), stringsAsFactors = FALSE)

stops <-cbind(as.data.frame(str_split_fixed(stops$trip_id, "-", 4),
                            stringsAsFactors = FALSE), 
              as.character(hms(stops$departure_time)),
              stops$stop_sequence,
              as.character(stops$trip_id),
              as.character(stops$stop_id))
colnames(stops) <- c("routeID", "departure_time", "direction", 
                     "service_id", "stop_time", "sequence", "trip_id", "id")

stops$id  <- as.character(stops$id)
#stops$service_id  <- as.numeric(stops$service_id)


today_now <- as.POSIXct(format(Sys.time(), tz="America/Anchorage",usetz=TRUE))

if(yday(today_now) == yday(mdy(paste0("12-24-",year(today_now))))) {
  service_id <- "1x"
} else if(wday(today_now) == 1) {
  service_id <- "3"
} else if(wday(today_now) == 7 ) {
  service_id <- "2"
} else {
  service_id <- "1"
 
}
#write delay table
delays <- data.frame(
  id = as.character(unlist(lapply(stop_departures[-1], function(x) x[[1]]))),
  routeID = unlist(lapply(stop_departures[-1], function(x) x[[3]][[5]][[1]])), 
  direction = unlist(lapply(stop_departures[-1], function(x) x[[3]][[6]])),
  dev = unlist(lapply(lapply(stop_departures[-1], function(x) x[[3]][[3]]), removenulls)),
  edt = unlist(lapply(stop_departures[-1], function(x) x[[3]][[1]])),
  sdt = as.character(hm(unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]]))) + minutes(1)),
  sdt_uncut = unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]])), 
  text = unlist(lapply(stop_departures[-1], function(x) x[[3]][[4]])),
  stop_time = unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]])),
  service_id = service_id,
  stringsAsFactors = FALSE) %>%
  filter(stop_time != "Done")

delays <- delays %>%
    mutate(direction = str_replace(direction, "L","O"))


delays <- delays %>% filter(as.numeric(strptime(edt, format = "%H:%M")) >
                  as.numeric(strptime(sdt_uncut, format = "%H:%M")))

combined_data <- inner_join(delays, stops, by = c("routeID", "sdt" = "stop_time", "direction", "service_id")) %>% 
  select(trip_id, dev, sequence) %>% 
  filter(dev > 0) %>% 
  arrange(trip_id) %>% 
  group_by(trip_id, dev)  

combined_data <- combined_data %>% group_by(trip_id) %>% filter(sequence == min(sequence))

if(dim(combined_data)[1] != 0) {

  data_for_protobuf <-   combined_data %>%
    mutate(min_seq = min(sequence)) %>%
    filter(min_seq == sequence) %>%
    unique() %>% group_by(trip_id, sequence) %>% filter(row_number(sequence) == 1) %>%
    arrange(trip_id, sequence) 
        
  current_trips <- unique(combined_data$trip_id)
  
  protobuf_list <- vector(mode = "list", length = length(current_trips))
  
  for(i in 1:length(current_trips)) {
    
    deviation <- data_for_protobuf %>% filter(trip_id == current_trips[i]) %>% arrange(sequence)
    stop_time_update_list <- vector(mode = "list", length = dim(deviation)[1])
    
    for(j in 1:dim(deviation)[1]) { 
    
      trip_id <- as.character(deviation$trip_id[j])
      
      stop_time_update_object <- new(transit_realtime.TripUpdate.StopTimeUpdate,
                                     stop_sequence = deviation$sequence[j],
                                     arrival = new(transit_realtime.TripUpdate.StopTimeEvent,
                                                   delay = as.numeric(deviation$dev[j]))
      )
      
      stop_time_update_list[j] <- stop_time_update_object
      
    }
    
    e <- new(transit_realtime.FeedEntity,
             id = as.character(deviation$trip_id[j]),
             trip_update = new(transit_realtime.TripUpdate,
                               trip = new(transit_realtime.TripDescriptor,
                                          trip_id = as.character(deviation$trip_id[j])),
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
  serialize(m, paste0(write_dir, "people_mover.pb"))
  
} else { # write no message in the protobuf.  Just update the header with the timestamp.
  
  header_object <- new(transit_realtime.FeedHeader,
                       gtfs_realtime_version = "1.0",
                       incrementality = "FULL_DATASET",
                       timestamp = as.numeric(as.POSIXlt(Sys.time(), "AKST")))
  
  m <- new(transit_realtime.FeedMessage,
           header = header_object) # use entity_list
  
  writeLines(as.character(m))
  serialize(m, paste0(write_dir, "people_mover.pb"))
}
