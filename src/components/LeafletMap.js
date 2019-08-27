import React from "react";
import L from "leaflet";
import ControlPanel from "./ControlPanel";
import { getMarkers, getMeetingpoints } from "./MapUtils";
import style from "../styles/LeafletMap.module.css";

class LeafletMap extends React.Component {
  markers = [];

  componentDidMount() {
    // Map must be rendered after map div is placed
    const bounds = new L.LatLngBounds(
      new L.LatLng(-90, -180),
      new L.LatLng(90, 180)
    );
    this.map = L.map("leafletMap", {
      center: [51.52, 0.22],
      zoom: 3,
      layers: [
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
            minZoom: 3,
            noWrap: true
          }
        )
      ],
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false
    });
  }

  // TODO: Move query handling down!
  handleQuery = (cities, from, to) => {
    if (this.markers.length > 0) {
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];
    }

    if (cities.length > 1 && from && to) {
      const destinations = cities.map(locString => locString.toUpperCase());

      getMeetingpoints(destinations, from, to).then(meetingpoints => {
        this.markers = getMarkers(meetingpoints);
        if (this.markers.length > 0) {
          this.markers.forEach(marker => {
            marker.addTo(this.map);
          });
        } else {
          console.log(destinations);
          alert("Could not find any flights for these cities and dates.");
        }
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ControlPanel handleQuery={this.handleQuery} />
        <div id="leafletMap" className={style.leafletMap} />
      </React.Fragment>
    );
  }
}

export default LeafletMap;
