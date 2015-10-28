library(plumber)
r <- plumb("/home/hans/api-realtime-bus/R/build_protobuf.R") 
#r <- plumb("/home/ht/Desktop/git/api-realtime-bus/R/build_protobuf.R") 
r$run(port=8001)
