library(RProtoBuf)
readProtoFiles("/home/ht/Desktop/git/api-realtime-bus/gtfs-realtime.proto")

#P("transit_realtime.FeedMessage")
ls("RProtoBuf:DescriptorPool")

new(transit_realtime.FeedMessage.FeedEntity)

header_object <- new(transit_realtime.FeedHeader,
                     gtfs_realtime_version = "1.0",
                     incrementality = "FULL_DATASET",
                     timestamp = 1)

new(transit_realtime.FeedEntity,  
    id = "test")   #, 
                
new(transit_realtime.FeedEntity.TripUpdate,
    trip = new(transit_realtime.FeedEntity.TripUpdate.TripDescriptor,
               trip_id = "test2"),
                     stop_time_update = new(transit_realtime.FeedEntity.TripUpdate.StopTimeEvent,
                                            delay = 60))

#write entity to list



m <- new(transit_realtime.FeedMessage,
         header = header_object,
         entity = entity_object) # use entity_list
writeLines(as.character(m))

serialize(m, NULL)