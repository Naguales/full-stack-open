import Weather from './Weather'

const Countries = ({
  normalizedFilter,
  filteredCountries,
  selectedCountry,
  onShowCountry,
  apiKey,
}) => {
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
            <button type="button" onClick={() => onShowCountry(country.name.common)}>
              Show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (selectedCountry) {
    const languages = Object.values(selectedCountry.languages || {})

    return (
      <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>Capital: {selectedCountry.capital?.join(', ') || 'Unknown'}</p>
        <p>Area: {selectedCountry.area}</p>
        <h2>Languages:</h2>
        <ul>
          {languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img
          src={selectedCountry.flags.svg}
          alt={selectedCountry.flags.alt || `Flag of ${selectedCountry.name.common}`}
          width="180"
        />
        <Weather key={selectedCountry.cca3} apiKey={apiKey} country={selectedCountry} />
      </div>
    )
  }

  return <p>No matches found</p>
}

export default Countries
