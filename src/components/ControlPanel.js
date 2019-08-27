import React from "react";
import Autocomplete from "./Autocomplete";
import style from "../styles/ControlPanel.module.css";
import Calendar from "./Calendar";

const citiesJSON = require("../utils/cities.json");

const selectedCities = (cities, removeButton) =>
  Object.keys(cities)
    .filter(key => cities[key])
    .map(city => (
      <div key={city} className={style.selectedCities}>
        <div className={style.selectedCityName}>{city}</div>
        <button type="button" onClick={e => removeButton(city, true)}>
          ×
        </button>
      </div>
    ));

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const initialState = {};
    citiesJSON.forEach(city => {
      initialState[city] = false;
    });
    return { cities: initialState, from: undefined, to: undefined };
  };

  updateSelectedCities = (cityName, remove) => {
    let { cities } = this.state;
    if (cityName in cities) {
      remove ? (cities[cityName] = false) : (cities[cityName] = true);
      this.setState(cities, () => this.sendQuery());
    }
  };

  updateTravelDates = (from, to) => {
    let newState = this.state;
    newState.from = from;
    newState.to = to;
    this.setState(newState, () => this.sendQuery());
  };

  sendQuery = () => {
    const { cities, from, to } = this.state;
    const chosenCities = Object.keys(cities).filter(key => cities[key]);
    const { handleQuery } = this.props;
    handleQuery(chosenCities, from, to);
  };

  render = () => (
    <div className={style.controlPanel}>
      <h1 className={style.heading}>FlightApp</h1>
      <p>
        Discover a new place to meet.
        <br /> Add cities to get started.
      </p>
      <div className={style.activeCities}>
        {selectedCities(this.state.cities, this.updateSelectedCities)}
      </div>
      <div className={style.userInput}>
        <Autocomplete
          updateSelectedCities={this.updateSelectedCities}
          suggestions={citiesJSON}
        />
        <Calendar updateTravelDates={this.updateTravelDates} />
      </div>
    </div>
  );
}

export default ControlPanel;
