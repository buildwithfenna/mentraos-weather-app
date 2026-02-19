import axios from 'axios';
import { WeatherData, WeatherLocation } from './types';

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is required');
    }
    this.apiKey = apiKey;
  }

  async getCurrentWeatherByCoords(lat: number, lng: number): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather`;
    const params = {
      lat: lat.toString(),
      lon: lng.toString(),
      appid: this.apiKey,
      units: 'imperial' // For Fahrenheit
    };

    try {
      const response = await axios.get(url, { params });
      return response.data as WeatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Weather API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async getCurrentWeatherByCity(cityName: string): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather`;
    const params = {
      q: cityName,
      appid: this.apiKey,
      units: 'imperial' // For Fahrenheit
    };

    try {
      const response = await axios.get(url, { params });
      return response.data as WeatherData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Weather API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async searchLocations(query: string): Promise<WeatherLocation[]> {
    const url = 'https://api.openweathermap.org/geo/1.0/direct';
    const params = {
      q: query,
      limit: 5,
      appid: this.apiKey
    };

    try {
      const response = await axios.get(url, { params });
      return response.data as WeatherLocation[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Geocoding API error: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to search locations');
    }
  }
}