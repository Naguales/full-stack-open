import { useEffect, useState } from 'react'
import weatherService from '../services/Weather'

const WEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn'
const WEATHER_ICON_ALT = 'Weather icon'

const Weather = ({ apiKey, country }) => {
  const [weatherResult, setWeatherResult] = useState(null)
  const [lat, lon] = country.capitalInfo?.latlng || []
  const hasCoordinates = lat !== undefined && lon !== undefined
  const weather = weatherResult?.data || null
  const weatherError = weatherResult?.error || ''
  const weatherIcon = weather?.weather?.[0]?.icon
  const weatherDescription = weather?.weather?.[0]?.description
  const weatherIconUrl = weatherIcon ? `${WEATHER_ICON_BASE_URL}/${weatherIcon}@2x.png` : ''

  useEffect(() => {
    if (!apiKey || !hasCoordinates) return

    let cancelled = false

    weatherService
      .getCurrent({ lat, lon, apiKey })
      .then((currentWeather) => {
        if (!cancelled) {
          setWeatherResult({
            data: currentWeather,
            error: '',
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherResult({
            data: null,
            error: 'Could not load weather data.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, hasCoordinates, lat, lon])

  return (
    <>
      <h2>Weather in {country.capital?.[0] || 'the capital'}</h2>
      {!apiKey && <p>Weather API key missing. Set VITE_OPENWEATHER_API_KEY before starting the app.</p>}
      {apiKey && !hasCoordinates && <p>Capital coordinates are unavailable for this country.</p>}
      {weatherError && <p>{weatherError}</p>}
      {weather && (
        <div>
          <p>Temperature {weather.main.temp} Celsius</p>
          {weatherIcon && (
            <img
              src={weatherIconUrl}
              alt={weatherDescription || WEATHER_ICON_ALT}
            />
          )}
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </>
  )
}

export default Weather
