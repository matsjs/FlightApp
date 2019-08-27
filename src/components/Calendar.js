import React from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "../styles/Calendar.css";

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      open: false,
      from: undefined,
      to: undefined
    };
  }

  handleDayClick = day => {
    const { updateTravelDates } = this.props;
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
    if (range.from && range.to) {
      updateTravelDates(range.from, range.to);
    }
  };

  handleResetClick = () => {
    this.setState(this.getInitialState());
  };

  handleOpenClick = () => {
    let newState = this.state;
    newState.open = newState.open ? false : true;
    this.setState(newState);
  };

  openCalendar = () => {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <div className="Calendar">
        <p>
          {!from && !to && "Please select departure date."}
          {from && !to && "Please select return date."}{" "}
          {from && to && (
            <button className="link" onClick={this.handleResetClick}>
              Reset
            </button>
          )}
        </p>
        <DayPicker
          className="Selectable"
          numberOfMonths={1}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
        />
      </div>
    );
  };
  render = () => {
    const { from, to, open } = this.state;
    return (
      <React.Fragment>
        <p>
          {from && to
            ? `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
            : "No dates set."}
        </p>
        <img
          className="calendarButton"
          alt="Calendar"
          src="icons/sharp-calendar_today-24px.svg"
          onClick={this.handleOpenClick}
        />
        {open ? this.openCalendar() : null}
      </React.Fragment>
    );
  };
}
