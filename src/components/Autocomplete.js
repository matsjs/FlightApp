import React, { Component, Fragment } from "react";
import style from "../styles/Autocomplete.module.css";

class Autocomplete extends Component {
  state = {
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: ""
  };

  onChange = e => {
    const { suggestions } = this.props;
    const target = e.currentTarget;
    const { value } = target;

    // Filter out suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().startsWith(value.toLowerCase())
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: value
    });
  };

  onClick = e => {
    const { updateSelectedCities } = this.props;
    const target = e.currentTarget;
    const { innerText } = target;

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });
    updateSelectedCities(innerText, false);
  };

  onKeyDown = e => {
    const { updateSelectedCities } = this.props;
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: ""
      });
      updateSelectedCities(filteredSuggestions[activeSuggestion], false);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;
    const offset = filteredSuggestions.length > 3 ? "-120px" : `${-33*filteredSuggestions.length}px`;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className={style.suggestion} style={{bottom: offset}}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = style.suggestionActive;
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className={style.suggestionNone}>
            <em>Not amoung our supprted cities, sorry.</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          placeholder={"Add a city here"}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
