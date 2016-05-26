gtfs_url <- "http://gtfs.muni.org/People_Mover.gtfs.zip"
zip_destination <- "/home/ht/Desktop/anc_gtfs.zip"
extract_to <- "/home/ht/Desktop"

download.file(url = gtfs_url,
              destfile = zip_destination)

unzip(zipfile = zip_destination,
      exdir = extract_to)
