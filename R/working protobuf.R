library(RProtoBuf)
download.file("https://developers.google.com/transit/gtfs-realtime/gtfs-realtime.proto", "/tmp/gtfs-realtime.proto")
readProtoFiles("/tmp/gtfs-realtime.proto")
P("transit_realtime.FeedMessage")

#done
header_object <- new(transit_realtime.FeedHeader,
                     gtfs_realtime_version = "1.0",
                     incrementality = "FULL_DATASET",
                     timestamp = 1)
writeLines(as.character(header_object))

##done
trip_descriptor_object <- new(transit_realtime.TripDescriptor,
                              trip_id = "test")							  
writeLines(as.character(trip_descriptor_object))

trip_update_object <- new(transit_realtime.TripUpdate,
                          trip = trip_descriptor_object,
                          delay = 60)
writeLines(as.character(trip_update_object))

feed_object <- new(transit_realtime.FeedEntity,
                   id = "test",
                   trip_update = trip_update_object)
writeLines(as.character(feed_object))

m <- new(transit_realtime.FeedMessage,
         header = header_object,
         entity = feed_object)

writeLines(as.character(m))
serialize(m, NULL)
