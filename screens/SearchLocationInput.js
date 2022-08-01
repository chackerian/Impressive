import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TextInput } from 'react-native';
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
  // props.city(city)
  // props.state(state)
  console.log(query);
  props.setLocation(query)
  // console.log(city, state)
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

  function onchange(event) {
    setQuery(event.target.value)
  }

  return (
    <View style={styles.inputdiv}>
      <TextInput
        style={styles.input}
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#e7e7e7",
    border: "none",
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
    width: "26em",
    fontSize: "1em",
    outlineStyle: "none",
  },
  inputdiv: {
    marginBottom: 12,
    marginTop: 12,
  },
})

export default SearchLocationInput;