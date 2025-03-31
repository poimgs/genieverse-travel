export interface TravelPost {
  id: string;
  title: string;
  link: string;
  address: string;
  images: string[];
  content: string;
  content_shorter_version: string;
  location_area: string;
  category_type: string;
  theme_highlights: string[];
  price_range: string;
  audience_suitability: string[];
  operating_hours: string;
  additional_attributes: string[];
  // Client-side only properties
  liked?: boolean;
  saved?: boolean;
}

// Response type from the API
export interface LocationsResponse {
  locations: TravelPost[];
}
