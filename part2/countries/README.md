# Full Stack Open - Part 2: Countries

This project is a React + Vite solution for the **Data for countries** exercises (2.18-2.20).

The app lets you search countries and shows:

- `> 10` matches: prompt to narrow the filter
- `2-10` matches: list of countries with a `Show` button
- `1` match: country details (capital, area, languages, flag) and current weather in the capital

## APIs used

- Countries data: `https://studies.cs.helsinki.fi/restcountries/api/all`
- Weather data: `https://api.openweathermap.org/data/2.5/weather`

## Requirements (local development)

- Node.js and npm
- OpenWeather API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app (PowerShell):

```powershell
$env:VITE_OPENWEATHER_API_KEY="YOUR_OPENWEATHER_API_KEY"; npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Notes

- Environment variable names must start with `VITE_` to be available in client code.
- If you change the API key, restart the dev server.
- New OpenWeather keys can take up to ~2 hours to activate.
- Do not commit real API keys to source control.
