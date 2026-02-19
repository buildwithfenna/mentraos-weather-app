# MentraOS Weather App

A MentraOS smart glasses app that displays current weather temperature in a clean reference card format.

## Features

- 🌡️ **Current Temperature** - Shows temperature in Fahrenheit
- 📍 **Location-Based** - Uses GPS when available, falls back to default city
- 🎤 **Voice Refresh** - Say "refresh", "update", or "weather" to update
- 🔄 **Button Refresh** - Press the select button to refresh weather data
- 🏙️ **City Display** - Shows the current location name
- 💨 **Weather Details** - Includes "feels like" temperature and conditions

## Setup

### Prerequisites

1. **MentraOS Developer Account**
   - Register at [console.mentraglass.com](https://console.mentraglass.com)
   - Create a new app and note your package name and API key

2. **OpenWeatherMap API Key**
   - Sign up at [openweathermap.org](https://openweathermap.org/api)
   - Get a free API key

3. **Development Tools**
   - Node.js 18+ installed
   - ngrok for local development

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/buildwithfenna/mentraos-weather-app.git
   cd mentraos-weather-app
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your keys:
   ```env
   MENTRAOS_PACKAGE_NAME=com.yourcompany.weather
   MENTRAOS_API_KEY=your_mentraos_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   PORT=3000
   ```

3. **MentraOS Console Setup**
   - **Package Name**: Use the same as in your `.env` file
   - **Webhook URL**: Your ngrok URL + `/webhook` (e.g., `https://abc123.ngrok.io/webhook`)
   - **Permissions**: 
     - `MICROPHONE` (for voice commands)
     - `LOCATION` (for location-based weather)

### Running the App

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Expose with ngrok** (in another terminal)
   ```bash
   ngrok http 3000
   ```

3. **Update Console**
   - Update your webhook URL in the MentraOS console with the ngrok URL

4. **Test on Glasses**
   - Open the Mentra app on your phone
   - Connect your glasses
   - Launch your weather app

## Usage

### Voice Commands
- Say **"refresh"**, **"update"**, or **"weather"** to refresh the current weather

### Button Controls
- Press the **select button** to refresh weather data

### Display
The app shows a reference card with:
- **Title**: Current city/location name
- **Content**: 
  - Current temperature in °F
  - "Feels like" temperature
  - Weather description (e.g., "partly cloudy")

## API Keys Required

| Service | Required | Purpose | Get Key |
|---------|----------|---------|----------|
| MentraOS | ✅ Yes | Glasses integration | [console.mentraglass.com](https://console.mentraglass.com) |
| OpenWeatherMap | ✅ Yes | Weather data | [openweathermap.org/api](https://openweathermap.org/api) |

## Permissions Explained

- **MICROPHONE**: Enables voice commands to refresh weather
- **LOCATION**: Automatically gets weather for your current location

*Note: If location permission is denied, the app defaults to San Francisco weather.*

## Development

### Build for Production
```bash
npm run build
npm start
```

### Linting and Formatting
```bash
npm run lint
npm run format
```

## Troubleshooting

### Common Issues

1. **"Loading" stuck on screen**
   - Check your OpenWeatherMap API key is valid
   - Ensure internet connectivity
   - Check console logs for API errors

2. **Voice commands not working**
   - Verify MICROPHONE permission is granted in MentraOS console
   - Check that glasses microphone is working

3. **Location not working**
   - Ensure LOCATION permission is granted
   - App will fallback to San Francisco if location fails

4. **Webhook not receiving data**
   - Verify ngrok is running and URL is correct in console
   - Check that webhook URL ends with `/webhook`
   - Ensure port 3000 is not blocked

### Logs
Check the console output for detailed logging of weather requests, voice commands, and any errors.

## License

MIT License - see LICENSE file for details.

## Support

For MentraOS development support, visit the [MentraOS documentation](https://docs.mentraglass.com) or join the developer community.