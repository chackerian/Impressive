import React, { useState, useEffect, useRef } from "react";
import TextInput from './TextInput'
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, props) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(cities)"] }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, props)
  );
}

async function handlePlaceSelect(updateQuery, props) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  var city = query.split(",")[0]
  var state = query.split(",")[1].replace(/[0-9]/g, '').replace(/\s/g, "");
  props.city(city)
  props.state(state)
  props.setLocation(query)
  console.log(city, state)
  console.log(addressObject);
}

function SearchLocationInput(props) {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDKZXVS2f74ntKveM2VAr0ReLdpKxkWkDc&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, props)
    );
  }, []);

  function getLocations() {
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&language=pt_BR&key=AIzaSyDKZXVS2f74ntKveM2VAr0ReLdpKxkWkDc`,
      headers: {}
    };
    axios(config)
    .then(function (response) {
      document.getElementById("select").innerHTML = ""
      response.data.predictions.forEach(element => {
        var option = document.createElement("option");
        option.text = element.description;
        option.value = element.description;

        let select = document.getElementById("select")
        select.appendChild(option)
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
    getLocations()
  }, [query])

  function onchange(event) {
    setQuery(event.target.value)
  }

  return (
    <div className="search-location-input">
      <TextInput
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
      <select id="select" onChange={onchange}>

      </select>
    </div>
  );
}

export default SearchLocationInput;