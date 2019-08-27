import L from "leaflet";
import { arrayExpression } from "@babel/types";
const CityICAO = require("../utils/city_icao.json");
const ICAOAir = require("../utils/icao_air.json");
const openskyURL = "https://opensky-network.org/api/flights/";

const openskyRequest = (icao, from, to, departure) => {
  let requestURL = departure
    ? new URL(openskyURL + "departure")
    : new URL(openskyURL + "arrival");
  requestURL.searchParams.append("airport", icao);
  requestURL.searchParams.append("begin", from);
  requestURL.searchParams.append("end", to);
  return fetch(requestURL)
    .then(response => response.json())
    .catch(error => console.log(error))
    .then(data => data);
};

const GetDepartures = async (airport, from, to) => {
  // Dates are set at noon, so we need to remove 12*60*60 seconds
  const UTCfrom = parseInt(from.getTime() / 1000).toFixed(0) - 12 * 60 * 60;
  const UTCto = parseInt(to.getTime() / 1000).toFixed(0) - 12 * 60 * 60;

  const ICAOids = CityICAO[airport];
  // Get all outbound flights within a day
  const outboundFlights = await Promise.all(
    ICAOids.map(icao =>
      openskyRequest(icao, UTCfrom, UTCfrom + 24 * 60 * 60, true)
    )
  );
  const inboundFlights = await Promise.all(
    ICAOids.map(icao =>
      openskyRequest(icao, UTCto, UTCto + 24 * 60 * 60, false)
    )
  );

  console.log("in and outbound -----");
  console.log(outboundFlights);
  console.log(inboundFlights);


  
  
  

  const departures = new Set(
    outboundFlights.flat().reduce((result, flight) => {
      if (
        flight &&
        flight["estArrivalAirport"] !== null &&
        flight["estArrivalAirport"] !== airport
      ) {
        result.push(flight["estArrivalAirport"]);
      }
      return result;
    }, [])
  );

  const arrivals = new Set(
    inboundFlights.flat().reduce((result, flight) => {
      if (
        flight &&
        flight["estDepartureAirport"] !== null &&
        flight["estDepartureAirport"] !== airport
      ) {
        result.push(flight["estDepartureAirport"]);
      }
      return result;
    }, [])
  );
  console.log("Get relevant data -----");

  console.log(departures);
  console.log(arrivals);

  Array.from(departures).forEach(city => {
    if (city in Array.from(arrivals)) {
      console.log("THIS IS VALID");
      console.log(city);
      
      
    }
  });
  console.log("......");
  console.log("......");

  
  
  

  return intersect(departures, arrivals);
};

const intersect = (setA, setB) => {
  return new Set([...setA].filter(x => setB.has(x)));
};

const icaoToCoord = locations =>
  locations.reduce((destinations, destinationICAO) => {
    let dest = ICAOAir[destinationICAO];
    if (dest) {
      destinations[dest.CITY] = {
        lat: dest.LAT_DEC_DEG,
        lon: dest.LONG_DEC_DEG
      };
    }
    return destinations;
  }, {});

const getMarkers = meetingpoints => {
  const cityCoordinates = icaoToCoord(meetingpoints);
  return Object.keys(cityCoordinates).map(city => {
    let coords = cityCoordinates[city];
    return L.marker([coords.lat, coords.lon], {
      title: city
    });
  });
};

const getMeetingpoints = async (originLocations, from, to) => {
  const departures = await Promise.all(
    originLocations.map(loc => GetDepartures(loc, from, to))
  );
  return Array.from(departures.reduce(intersect));
};

export { getMarkers, getMeetingpoints };
