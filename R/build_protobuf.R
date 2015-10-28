#' @get /test
purely_symbolic <- function() {
library(lubridate)
library(dplyr)
library(XML)
library(lubridate)
library(tidyr)
library(stringr)
library(jsonlite)
#library(RProtoBuf)

stops <- read.csv("/home/hans/api-realtime-bus/R/gtfs/stop_times.txt", stringsAsFactors = FALSE)
stops <- read.csv("gtfs/stop_times.txt", stringsAsFactors = FALSE)
stops$departure_time <- as.numeric(gsub(":", "", gsub("00", "", stops$departure_time)))
stops <-cbind(as.data.frame(str_split_fixed(stops$trip_id, "-", 4),
                               stringsAsFactors = FALSE), 
              stops$departure_time,
              stops$stop_sequence,
              stops$trip_id)
colnames(stops) <- c("routeID", "departure_time", "direction", 
                     "service_id", "stop_time", "sequence", "trip_id")

#get delay infomation
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

protobuf_list <- vector(mode = "list", length = length(current_trips) + 1)

data_for_protobuf %>% arrange(trip_id, sequence)



for(i in 2:(length(current_trips) + 1) ) {

  deviation <- data_for_protobuf %>% filter(trip_id == current_trips[i]) 
  
trip_info <- list(trip_id = as.character(deviation$trip_id[1]),
                  stop_time_update = list(stop_sequence = deviation$sequence[1],
                                          arrival = as.numeric(deviation$dev[1]))
                  )

protobuf_list[i] <- list(entity = list(id = "entity-spacer",
                         trip = trip_info))

}

protobuf_list[1] <- list(header = list(gtfs_realtime_version = "1.0",
                   incrementalitiy = "FULL_DATASET",
                   timestamp = as.numeric(as.POSIXlt(Sys.time(), "AKST")) ))
     
protobuf_list
#paste("Hello World")
}
