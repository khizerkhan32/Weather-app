import { useEffect, useState } from 'react';
import './App.css';
import clear from './assets/clear.jpg';
import cloudy from './assets/cloudy.jpg';
import overcast from './assets/overcast.jpg';
import rainy from './assets/rainy.jpg';
import snow from './assets/snow.jpg';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [place, setPlace] = useState('New york');
  const [placeInfo, setPlaceInfo] = useState({});

  useEffect(() => {
    handlefetch();
  }, []);

  const handlefetch = () => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=2b659b7217534ad4a5152425240806&q=${place}&days=1&aqi=no&alerts=no`
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Please write correct city name');
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) =>
        setPlaceInfo({
          name: data.location.name,
          country: data.location.country,
          celsius: {
            current: data.current.temp_c,
            high: data.forecast.forecastday[0].day.maxtemp_c,
            low: data.forecast.forecastday[0].day.mintemp_c,
          },
          condition: data.current.condition.text,
        })
      )
      .catch((error) => {
        alert(error.message);
      });
    setPlace('');
  };

  return (
    <div
      className="app"
      style={
        placeInfo.condition?.toLowerCase() === 'clear' ||
        placeInfo.condition?.toLowerCase() === 'sunny'
          ? { backgroundImage: `url(${clear})` }
          : placeInfo.condition?.toLowerCase().includes('cloudy')
          ? { backgroundImage: `url(${cloudy})` }
          : placeInfo.condition?.toLowerCase().includes('rainy')
          ? { backgroundImage: `url(${rainy})` }
          : placeInfo.condition?.toLowerCase().includes('snow')
          ? { backgroundImage: `url(${snow})` }
          : { backgroundImage: `url(${overcast})` }
      }
    >
      <div className="search-input">
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handlefetch();
            }
          }}
        />
        <SearchIcon
          onClick={handlefetch}
          fontSize="large"
          className="search-button"
        />
        {/* <button onClick={handlefetch}>Search</button> */}
      </div>
      <div className="Weather-Container">
        <div className="top-part">
          <h1>{placeInfo.celsius?.current}°C</h1>
          <div className="condition-high-low">
            <h1>{placeInfo.condition}</h1>
            <h1>{placeInfo.celsius?.high}°C highest</h1>
            <h1>{placeInfo.celsius?.low}°C lowest</h1>
          </div>
        </div>
        <h2>
          {placeInfo.name},{placeInfo.country}
        </h2>
      </div>
    </div>
  );
}

export default App;
