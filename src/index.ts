import { AppServer, AppSession } from '@mentraos/sdk';
import { WeatherService } from './weather';
import { config } from 'dotenv';

// Load environment variables
config();

class WeatherApp extends AppServer {
  private weatherService: WeatherService;

  constructor() {
    super({
      packageName: process.env.MENTRAOS_PACKAGE_NAME!,
      apiKey: process.env.MENTRAOS_API_KEY!,
      port: parseInt(process.env.PORT || '3000')
    });

    this.weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY!);
  }

  protected async onSession(session: AppSession, sessionId: string, userId: string) {
    session.logger.info('Weather app session started', { userId });

    // Show initial loading message
    session.layouts.showReferenceCard('Weather', 'Loading current temperature...');

    // Load and display weather
    await this.loadAndDisplayWeather(session);

    // Listen for voice commands to refresh
    session.events.onTranscription((data) => {
      if (data.isFinal) {
        const text = data.text.toLowerCase();
        if (text.includes('refresh') || text.includes('update') || text.includes('weather')) {
          session.logger.info('Refreshing weather via voice command', { command: data.text });
          this.loadAndDisplayWeather(session);
        }
      }
    });

    // Listen for button presses
    session.events.onButtonPress((data) => {
      if (data.action === 'press' && data.button === 'select') {
        session.logger.info('Refreshing weather via button press');
        this.loadAndDisplayWeather(session);
      }
    });
  }

  private async loadAndDisplayWeather(session: AppSession) {
    try {
      // First try to get location if permission is available
      if (session.capabilities?.hasLocation) {
        // Subscribe to location updates temporarily
        const locationPromise = new Promise<{ lat: number; lng: number }>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Location timeout')), 10000);
          
          const unsubscribe = session.location.subscribeToStream(
            { accuracy: 'balanced' },
            (locationData) => {
              clearTimeout(timeout);
              unsubscribe();
              resolve({ lat: locationData.lat, lng: locationData.lng });
            }
          );
        });

        try {
          const location = await locationPromise;
          const weather = await this.weatherService.getCurrentWeatherByCoords(
            location.lat,
            location.lng
          );
          this.displayWeather(session, weather);
        } catch (locationError) {
          session.logger.warn('Failed to get location, using default city', { error: locationError });
          // Fallback to default city
          await this.loadDefaultWeather(session);
        }
      } else {
        // No location permission, use default city
        await this.loadDefaultWeather(session);
      }
    } catch (error) {
      session.logger.error('Failed to load weather data', { error });
      session.layouts.showReferenceCard(
        'Weather Error',
        'Unable to load weather data.\nSay "refresh" to try again.'
      );
    }
  }

  private async loadDefaultWeather(session: AppSession) {
    // Default to San Francisco if no location available
    const weather = await this.weatherService.getCurrentWeatherByCity('San Francisco, CA');
    this.displayWeather(session, weather);
  }

  private displayWeather(session: AppSession, weather: any) {
    const temp = Math.round(weather.main.temp);
    const location = weather.name;
    const description = weather.weather[0].description;
    const feelsLike = Math.round(weather.main.feels_like);
    
    const weatherInfo = `${temp}°F\nFeels like ${feelsLike}°F\n${description}`;
    
    session.layouts.showReferenceCard(location, weatherInfo);
    session.logger.info('Weather displayed', { location, temp, description });
  }

  protected async onStop(sessionId: string, userId: string, reason: string) {
    this.logger.info('Weather app session ended', { sessionId, userId, reason });
  }
}

// Start the server
const app = new WeatherApp();
app.start().then(() => {
  console.log('🌤️  MentraOS Weather App started successfully!');
  console.log('📱 Connect your glasses and start the app to see current weather');
}).catch((error) => {
  console.error('❌ Failed to start Weather App:', error);
  process.exit(1);
});