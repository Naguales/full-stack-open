import { useEffect, useState } from 'react'
import CountryFilter from './components/CountryFilter'
import Countries from './components/Countries'
import countriesService from './services/Countries'

function App() {
  const [countryFilter, setCountryFilter] = useState('')
  const [countries, setCountries] = useState([])
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

  return (
    <>
      <CountryFilter value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} />
      <Countries
        normalizedFilter={normalizedFilter}
        filteredCountries={filteredCountries}
        selectedCountry={selectedCountry}
        onShowCountry={setCountryFilter}
        apiKey={apiKey}
      />
    </>
  )
}

export default App
