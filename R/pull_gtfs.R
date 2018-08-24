gtfs_url <- "http://gtfs.muni.org/People_Mover.gtfs.zip"
zip_destination <- "/home/ubuntu/anc_gtfs.zip"
extract_to <- "/home/ubuntu/api-realtime-bus/R/gtfs/"

download.file(url = gtfs_url,
              destfile = zip_destination)

unzip(zipfile = zip_destination,
      exdir = extract_to)
