import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getCurrent = ({ lat, lon, apiKey }) => {
  return axios
    .get(baseUrl, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
    })
    .then((response) => response.data)
}

export default { getCurrent }
