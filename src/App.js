import React, { useState, useEffect } from 'react';
import { format } from 'react-string-format';

  const App = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState(null);
  const [locationKey, setLocation] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getWeather = () => {
    fetch(format('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/{0}?language=en-us&apikey=yDLAJV3XBOSYGjk4Vier2AXrWcrB4aAs',locationKey),
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

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude); 
        
        fetch(format('http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q={0},{1}&apikey=yDLAJV3XBOSYGjk4Vier2AXrWcrB4aAs',lat,lng),
          {
            method: "GET"
          }
        )
        .then(res => res.json())
        .then(
          (result) => {
            setStatus(null);
            setIsLoaded(true);
            setLocation(result.Key);
            setPlace(format('{0},{1},{2}',result.LocalizedName, result.AdministrativeArea.ID,result.Country.ID));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
      }, () => {
        setStatus('Unable to retrieve your location');
      });
    }          
  },[]);


  return (
    <div className="App">
      <p>{status}</p>
      <button onClick={getWeather}>Weather forecast in {place} for next 12 hours</button>
     <ul>
          {items.map(item => (
            <li key={item.EpochDateTime}>
             {item.DateTime}&nbsp;{item.Temperature.Value}&nbsp;{item.Temperature.Unit}
            </li>
          ))}
      </ul>
     
    </div>
  );
}



export default App;