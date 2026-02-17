const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = async () => {
  const response = await fetch(`${baseUrl}/all`)

  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  return response.json()
}

export default { getAll }
