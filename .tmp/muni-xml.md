# Muni bus feeds.

// Route Format
[route id]-[start time]-[direction (I/O)]-[service id]

Calendar.txt CalendarDates.txt (service_ID is overwritten) - Overwritten on Dec
24th.  Needed to avoid collisions for weekend vs. weekday runs.

// What is the Service ID?
// Calendar Date related
// Direction (Inbound / Outbound)?

Will google be able to make a source out of a non-muni.org domain?
- Research

http://bustracker.muni.org/InfoPoint/XML/vehiclelocation.xml
http://bustracker.muni.org/InfoPoint/XML/stopdepartures.xml
http://bustracker.muni.org/InfoPoint/XML/publicmessages.xml
http://bustracker.muni.org/InfoPoint/XML/stops.xml
http://bustracker.muni.org/InfoPoint/XML/routestops.xml
http://bustracker.muni.org/InfoPoint/XML/routes.xml


1)       Data Format

a)       Stop Departure schema
<?xml version="1.0"?>
<!DOCTYPE departures [
  <!ELEMENT departures (generated, stop*)>
  <!ELEMENT generated (#PCDATA)>
    <!ATTLIST generated timezone CDATA #REQUIRED>
  <!ELEMENT stop (id, name, departure*)>
  <!ELEMENT id (#PCDATA)>
  <!ELEMENT name (#PCDATA)>
  <!ELEMENT departure (edt, sdt, dev, internal_sign_description, internet_service_description, ivr_service_description, route)>
    <!ATTLIST departure mode (route|destination) #REQUIRED>
  <!ELEMENT edt (#PCDATA)>
  <!ELEMENT sdt (#PCDATA)>
  <!ELEMENT dev (#PCDATA)>
  <!ELEMENT internal_sign_description (#PCDATA)>
  <!ELEMENT internet_service_description (#PCDATA)>
  <!ELEMENT ivr_service_description (#PCDATA)>
  <!ELEMENT route (id, name, ivr_route_description)>
  <!ELEMENT ivr_route_description  (#PCDATA)>
  <!ELEMENT dir (#PCDATA)>

]>

b)       Stops schema
<?xml version="1.0"?>
<!DOCTYPE stops [
  <!ELEMENT stops (stop*)>
  <!ELEMENT stop (name, id, latitude, longitude)>
  <!ELEMENT name (#PCDATA)>
  <!ELEMENT id (#PCDATA)>
  <!ELEMENT latitude (#PCDATA)>
  <!ELEMENT longitude (#PCDATA)>

]>

c)       Vehicle Location schema
<?xml version="1.0"?>
<!DOCTYPE vehicle-locations [
  <!ELEMENT vehicle-locations (report-generated, vehicle*)>
  <!ELEMENT report-generated (#PCDATA)>
<!-- timezone is an integer between -12 and 12 inclusive. -->
                <!-- the timezone is reference to GMT and is -5 for State College. -->
                <!ATTLIST report-generated timezone CDATA #REQUIRED>
  <!ELEMENT vehicle (name, routeid, tripid, runid*, internal_sign_description, internet_sign_description, destination*, direction, laststop, latitude, longitude, speed, heading, onboard, deviation, driver_name)>
    <!ATTLIST vehicle op-status (on-time|late|early|out-of-service|special|none) #REQUIRED>
    <!ATTLIST vehicle comm-status (good|unknown) #REQUIRED>
    <!ATTLIST vehicle gps-status (good|bad|unknown) #REQUIRED>
  <!ELEMENT name (#PCDATA)>
  <!ELEMENT routeid (#PCDATA)>
  <!ELEMENT tripid (#PCDATA)>
  <!ELEMENT runid (#PCDATA)>
  <!ELEMENT internal_sign_description(#PCDATA)>
  <!ELEMENT internet_sign_description (#PCDATA)>
  <!ELEMENT direction (#PCDATA)> <!-- I, O, or L -->
  <!ELEMENT laststop (#PCDATA)>
  <!ELEMENT latitude (#PCDATA)>
  <!ELEMENT longitude (#PCDATA)>
  <!ELEMENT speed (#PCDATA)>
    <!ATTLIST speed units (mph|kph) "mph">
  <!ELEMENT heading (#PCDATA)>
      <!ELEMENT onboard (#PCDATA)>
                 <!ELEMENT deviation (#PCDATA)>
<!ELEMENT driver_name (#PCDATA)>

]>

d)       Public Messages schema
<?xml version="1.0"?>
<!DOCTYPE publicmessages [
  <!ELEMENT publicmessages (report-generated, message*)>
  <!ELEMENT report-generated (#PCDATA)>
<!--timezone is an integer between -12 and 12 inclusive.-->
<!-- the timezone is reference to GMT and is -5 for State College. -->
    <!ATTLIST report-generated timezone CDATA #REQUIRED>
  <!ELEMENT message (messagetext, startdate, enddate, starttime, endtime,signId)>
<!-- priority 1 = low, 2 = med, 3 = high -->
    <!ATTLIST message priority (1|2|3) #REQUIRED>
                <!-- dates are in format 'yyyy-mm-dd' -->
  <!ELEMENT messagetext (#PCDATA)>
  <!ELEMENT startdate (#PCDATA)>
  <!ELEMENT enddate (#PCDATA)>
<!-- times are in format 'hh:mm' -->
  <!ELEMENT starttime (#PCDATA)>
  <!ELEMENT endtime (#PCDATA)>
  <!ELEMENT signId (#PCDATA)>

]>

e)       Routes schema
<?xml version="1.0"?>
<!DOCTYPE routes [
  <!ELEMENT routes (route*)>
  <!ELEMENT route (route_number, short_name, long_name)>
  <!ELEMENT route_number (#PCDATA)>
  <!ELEMENT short_name (#PCDATA)>
  <!ELEMENT long_name (#PCDATA)>
]>
f)        RouteStops schema
<?xml version="1.0"?>
<!DOCTYPE routestops [
  <!ELEMENT routestops (routestop*)>
  <!ELEMENT routestop (route_number, stop_id, sort_order)>
  <!ELEMENT route_number (#PCDATA)>
  <!ELEMENT stop_id (#PCDATA)>
  <!ELEMENT sort_order (#PCDATA)>

]>

g)       Signs schema


<?xml version="1.0"?>
<!DOCTYPE signs [
  <!ELEMENT signs (sign*)>
  <!ELEMENT sign (signId, description)>
  <!ELEMENT signId(#PCDATA)>
  <!ELEMENT description(#PCDATA)>

]>

h)       Headway Schedule schema
<?xml version="1.0"?>
<!DOCTYPE headway_schedule [
  <!ELEMENT headway_schedule ( generated_timestamp, headway_schedule_results)>
  <!ELEMENT generated_timestamp(#PCDATA)>
  <!ELEMENT headway_schedule_results ( headway_trip*)>
  <!ELEMENT headway_trip (Trip_Id, Route_Id, Scheduled_Headway_Interval, Trip_Label, Start_Time, End_Time, internal_sign_description, internet_service_description, ivr_service_description, Headway_Interval )>
  <!ELEMENT Trip_Id(#PCDATA)>
  <!ELEMENT Route_Id(#PCDATA)>
  <!ELEMENT Scheduled_Headway_Interval(#PCDATA)>
  <!ELEMENT Trip_Label(#PCDATA)>
  <!ELEMENT Start_Time(#PCDATA)>
  <!ELEMENT End_Time(#PCDATA)>
  <!ELEMENT internal_sign_description(#PCDATA)>
  <!ELEMENT internet_service_description(#PCDATA)>
  <!ELEMENT ivr_service_description(#PCDATA)>
  <!ELEMENT Headway_Interval(#PCDATA)>

]>



i)          <!DOCTYPE routestopsdirections [

                <!ELEMENT routestopsdirections (routestopsdirection*)>

                                <!ELEMENT routestopsdirection (RouteNum, StopId, Direction, Order, SL_ID, Service_Level_Description, TimePoint)>

                                                <!ELEMENT RouteNum (#PCDATA)>

                                                <!ELEMENT StopId (#PCDATA)>

                                               <!ELEMENT Direction (#PCDATA)>

                                               <!ELEMENT Order (#PCDATA)>

                                               <!ELEMENT SL_ID (#PCDATA)>

                                               <!ELEMENT Service_Level_Description (#PCDATA)>

                                               <!ELEMENT TimePoint (#PCDATA)>

]>

j)        <!DOCTYPE servicedates [

                <!ELEMENT servicedates (servicedate*)>

                                <!ELEMENT servicedate (SL_Date, SL_Id)>

                                                <!ELEMENT SL_Date (#PCDATA)>

                                                <!ELEMENT SL_Id (#PCDATA)>

]>
