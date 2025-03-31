import { TravelPost, LocationsResponse } from '../types/travel';

const API_BASE_URL = 'http://localhost:5000/api';
export const API_IMAGE_BASE_URL = 'http://localhost:5000';

export const api = {
  async getLocations(): Promise<TravelPost[]> {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    const data = await response.json() as LocationsResponse;
    return data.locations.map(location => ({
      ...location,
      images: location.images.map(image => `${API_IMAGE_BASE_URL}${image}`)
    }));
  }
};
