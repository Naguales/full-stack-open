import { useEffect, useState } from 'react'
import CountryFilter from './components/CountryFilter'
import countriesService from './services/Countries'
import weatherService from './services/Weather'

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [weatherResult, setWeatherResult] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    countriesService.getAll().then((allCountries) => {
      setCountries(allCountries)
    })
  }, [])

  const normalizedFilter = countryFilter.trim().toLowerCase()
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(normalizedFilter),
  )
  const selectedCountry = filteredCountries.length === 1 ? filteredCountries[0] : null

  useEffect(() => {
    if (!selectedCountry || !apiKey) return

    const [lat, lon] = selectedCountry.capitalInfo?.latlng || []
    if (lat === undefined || lon === undefined) return

    let cancelled = false

    weatherService
      .getCurrent({ lat, lon, apiKey })
      .then((currentWeather) => {
        if (!cancelled) {
          setWeatherResult({
            countryCode: selectedCountry.cca3,
            data: currentWeather,
            error: '',
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherResult({
            countryCode: selectedCountry.cca3,
            data: null,
            error: 'Could not load weather data.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedCountry, apiKey])

  const renderCountries = () => {
    if (normalizedFilter === '') {
      return null
    }

    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button type="button" onClick={() => setCountryFilter(country.name.common)}>
                Show
              </button>
            </li>
          ))}
        </ul>
      )
    }

    if (selectedCountry) {
      const country = selectedCountry
      const languages = Object.values(country.languages || {})
      const [lat, lon] = country.capitalInfo?.latlng || []
      const hasCoordinates = lat !== undefined && lon !== undefined
      const weather =
        weatherResult?.countryCode === country.cca3 ? weatherResult.data : null
      const weatherError =
        weatherResult?.countryCode === country.cca3 ? weatherResult.error : ''
      const weatherIcon = weather?.weather?.[0]?.icon
      const weatherDescription = weather?.weather?.[0]?.description

      return (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital?.join(', ') || 'Unknown'}</p>
          <p>Area: {country.area}</p>
          <h2>Languages:</h2>
          <ul>
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            width="180"
          />
          <h2>Weather in {country.capital?.[0] || 'the capital'}</h2>
          {!apiKey && <p>Weather API key missing. Set VITE_OPENWEATHER_API_KEY before starting the app.</p>}
          {apiKey && !hasCoordinates && <p>Capital coordinates are unavailable for this country.</p>}
          {weatherError && <p>{weatherError}</p>}
          {weather && (
            <div>
              <p>Temperature {weather.main.temp} Celsius</p>
              {weatherIcon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                  alt={weatherDescription || 'Weather icon'}
                />
              )}
              <p>Wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )
    }

    return <p>No matches found</p>
  }

  return (
    <>
      <CountryFilter value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} />
      {renderCountries()}
    </>
  )
}

export default App
