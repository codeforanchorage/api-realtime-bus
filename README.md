# api-realtime-bus
Create a realtime bus API for Transit App, Google and other services to use in coordination with the Muni.

The goal is to use XML from Infopoint and copy it to a a server once a minute. The API would be run off that server with the hopes of feeding Transit App which allows you to set reminders for a bus stop to be notified x minutes before the bus is going to arrive. [Transit App developer info](http://transitapp.com/developers) We could also use this for other transit apps and Google realtime.
The realtime ETAs comes from [here.](http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml)

The goal would be to have it up and working before Snow City gives away free coffee for there being an inch of snow that sticks in Anchorage this year.

GTFS buffers in javaScript. 
https://stackoverflow.com/questions/18523235/how-do-you-decode-gtfs-protobufs-in-node

Testable live feed.
http://developer.trimet.org/ws/V1/FeedSpecAlerts/?appID=618F30BB3062F39AF24AED9EC
