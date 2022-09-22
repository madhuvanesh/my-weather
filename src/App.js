import React, { useState, useEffect, Children } from 'react';
import { format } from 'react-string-format';
import Moment from 'moment';
import configData from "./config.json";

  const App = () => {
  // const [lat, setLat] = useState(0.0);
  // const [lng, setLng] = useState(0.0);
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState(null);
  const [locationKey, setLocationKey] = useState("");
  const [items, setItems] = useState([]);
  //const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getWeather = () => {

    fetch(format('{0}{1}forecasts/v1/hourly/12hour/{2}?language=en-us&apikey={3}',configData.herokuappurl,configData.accuweatherurl,locationKey,configData.accuweatherappkey),
      {
        method: "GET"
      }
    )
    .then(res => res.json())
    .then(
      (result) => {
        setItems(result);        
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
         setIsLoaded(true);
         setError(error);
        }     
    )
  }

  const logout = () =>{

  }

  useEffect(() => {      
    console.log("componentDidMount");
    
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        //setLat(position.coords.latitude);
        //setLng(position.coords.longitude);                 

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        fetch(format('{0}locations/v1/cities/geoposition/search?q={1},{2}&apikey={3}',configData.accuweatherurl,lat,lng,configData.accuweatherappkey),
          {
            method: "GET"
          }
        )
        .then(res => res.json())
        .then(
          (result) => {
            setStatus(null);
            setIsLoaded(true);
            setLocationKey(result.Key);
            setPlace(format('{0},{1},{2}',result.LocalizedName, result.AdministrativeArea.ID,result.Country.ID));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
      }, () => {
        setStatus('Unable to retrieve your location');
      });      
    }

    return () => {
      console.log("componentDidUnmount");
    };
   
  },[]);


  return (
    <div className="App">
      <p>{status}</p>
      <button id="forecast" onClick={getWeather}>Click here to fetch weather forecast in {place}, locationKey: {locationKey} for next 12 hours:</button>
     <ul>
          {items.map(item => (
            <li key={item.EpochDateTime}>
             {Moment(item.DateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}&nbsp;{item.Temperature.Value}&nbsp;{item.Temperature.Unit}
            </li>
          ))}
      </ul>
     <button id="signout"  onClick={(e) => {
      e.preventDefault();
      window.location.href='/signout';
      }}>Logout</button>
    </div>
  );
}



export default App;