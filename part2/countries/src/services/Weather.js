const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getCurrent = async ({ lat, lon, apiKey }) => {
  const response = await fetch(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  return response.json()
}

export default { getCurrent }
