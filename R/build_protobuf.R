library(lubridate)
library(dplyr)
library(XML)
library(stringr)
library(RProtoBuf)

base_dir <- "/home/ht/Desktop/git/api-realtime-bus/"

readProtoFiles(paste0(base_dir, "gtfs-realtime.proto"))
stops <- read.csv(paste0(base_dir, "R/gtfs/stop_times.txt"), stringsAsFactors = FALSE)
#stops <- read.csv("gtfs/stop_times.txt", stringsAsFactors = FALSE)
stops$departure_time <- as.numeric(gsub(":", "", gsub("00", "", stops$departure_time)))
stops <-cbind(as.data.frame(str_split_fixed(stops$trip_id, "-", 4),
                               stringsAsFactors = FALSE), 
              stops$departure_time,
              stops$stop_sequence,
              stops$trip_id)
colnames(stops) <- c("routeID", "departure_time", "direction", 
                     "service_id", "stop_time", "sequence", "trip_id")

#get delay infomation
#stop_departures <- xmlToList(xmlParse(paste0(base_dir, "api-realtime-bus/stopdepartures.xml")))
stop_departures <- xmlToList(xmlParse("http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml")) 
#use this function for parsing 
removenulls <- function(x) {ifelse(is.null(x), NA, x)}
#write delay table
delays <- data.frame(
  id = as.numeric(unlist(lapply(stop_departures[-1], function(x) x[[1]]))),
  routeID = unlist(lapply(stop_departures[-1], function(x) x[[3]][[5]][[1]])), 
  direction = unlist(lapply(stop_departures[-1], function(x) x[[3]][[6]])),
  dev = unlist(lapply(lapply(stop_departures[-1], function(x) x[[3]][[3]]), removenulls)),
  edt = unlist(lapply(stop_departures[-1], function(x) x[[3]][[1]])),
  stop_time = unlist(lapply(stop_departures[-1], function(x) x[[3]][[2]])),
  stringsAsFactors = FALSE)

#make standard stop time in delays a numeric value
delays$stop_time <- as.numeric(gsub(":","", delays$stop_time))


#just use weekday service id for now
stops <- stops %>% filter(service_id == 1)

combined_data <- inner_join(delays, stops, by = c("routeID", "direction", "stop_time"))
           
data_for_protobuf <- combined_data %>% select(trip_id, sequence, dev)

#data_for_protobuf$dev[c(40, 60)] <- "60"

data_for_protobuf <- data_for_protobuf %>% filter(dev != 0)

current_trips <- unique(as.character(data_for_protobuf$trip_id))

protobuf_list <- vector(mode = "list", length = length(current_trips))

data_for_protobuf %>% arrange(trip_id, sequence)



for(i in 1:length(current_trips)) {
 
   deviation <- data_for_protobuf %>% filter(trip_id == current_trips[i]) 
  
  entity_id <- as.character(deviation$trip_id[1])
  n_seconds_delay <- as.numeric(deviation$dev[1])
  stop_sequence_number <- deviation$sequence[1]
  trip_id <- as.character(deviation$trip_id[1])
  
  e <- new(transit_realtime.FeedEntity,
           id = entity_id,
           trip_update = new(transit_realtime.TripUpdate,
                             trip = new(transit_realtime.TripDescriptor,
                                        trip_id = "test"),
                             stop_time_update = new(transit_realtime.TripUpdate.StopTimeUpdate,
                                                    stop_sequence = stop_sequence_number,
                                                    arrival = new(transit_realtime.TripUpdate.StopTimeEvent,
                                                                  delay = n_seconds_delay)
                             )
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