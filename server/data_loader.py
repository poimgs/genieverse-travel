import pandas as pd
import logging
import os
from typing import Optional, List, Dict, Tuple, Any

class DataLoader:
    def __init__(self):
        self.df: Optional[pd.DataFrame] = None
        self.locations_cache: Optional[List[Dict[str, Any]]] = None

    def load_data(self, csv_path: str) -> Optional[pd.DataFrame]:
        """Loads data from the CSV file."""
        if self.df is not None:
            return self.df

        try:
            df = pd.read_csv(csv_path)
            # Basic cleaning: fill NaNs in key text fields
            text_cols = ['title', 'content_shorter_version', 'location_area', 'category_type', 
                        'theme_highlights', 'audience_suitability', 'additional_attributes', 'price_range']
            for col in text_cols:
                if col in df.columns:
                    df[col] = df[col].fillna('')
                else:
                    logging.warning(f"Column '{col}' not found in CSV. Skipping.")
            # Ensure index is string
            df['index'] = df['index'].astype(str)
            logging.info(f"Loaded {len(df)} locations from {csv_path}")
            self.df = df
            return df
        except FileNotFoundError:
            logging.error(f"Error: CSV file not found at {csv_path}")
            return None
        except Exception as e:
            logging.error(f"Error loading CSV: {e}")
            return None

    def get_formatted_locations(self) -> List[Dict[str, Any]]:
        """Returns formatted locations with images."""
        if self.locations_cache is not None:
            return self.locations_cache

        if self.df is None:
            return []

        locations = []
        for _, row in self.df.iterrows():
            # Get the list of images for this location
            location_id = str(row['index']).zfill(6)
            image_dir = f"data/images/{location_id}"
            images = []
            if os.path.exists(image_dir):
                images = [f"/images/{location_id}/{f}" for f in os.listdir(image_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
            
            # Convert string lists to actual lists
            theme_highlights = row['theme_highlights'].split(',') if row['theme_highlights'] else []
            audience_suitability = row['audience_suitability'].split(',') if row['audience_suitability'] else []
            additional_attributes = row['additional_attributes'].split(',') if row['additional_attributes'] else []
            
            location = {
                "id": str(row['index']),
                "title": str(row['title']),
                "link": str(row['link']) if 'link' in row else "",
                "address": str(row['address']) if 'address' in row else "",
                "images": images,
                "content": str(row['content']) if 'content' in row else "",
                "content_shorter_version": str(row['content_shorter_version']),
                "location_area": str(row['location_area']),
                "category_type": str(row['category_type']),
                "theme_highlights": theme_highlights,
                "price_range": str(row['price_range']),
                "audience_suitability": audience_suitability,
                "operating_hours": str(row['operating_hours']) if 'operating_hours' in row else "",
                "additional_attributes": additional_attributes
            }
            locations.append(location)

        self.locations_cache = locations
        return locations

    def prepare_documents(self) -> Tuple[List[str], List[Dict[str, Any]], List[str]]:
        """Prepares documents for embedding and stores metadata."""
        if self.df is None:
            return [], [], []

        documents = []
        metadatas = []
        ids = []
        for _, row in self.df.iterrows():
            content_to_embed = f"Title: {row['title']}\n" \
                            f"Area: {row['location_area']}\n" \
                            f"Category: {row['category_type']}\n" \
                            f"Themes: {row['theme_highlights']}\n" \
                            f"Audience: {row['audience_suitability']}\n" \
                            f"Price: {row['price_range']}\n" \
                            f"Summary: {row['content_shorter_version']}\n" \
                            f"Attributes: {row['additional_attributes']}"
            documents.append(content_to_embed)
            metadata = {
                'index': str(row['index']),
                'title': str(row['title']),
                'link': str(row.get('link', '')),
                'image': str(row.get('image', '')),
                'address': str(row.get('address', '')),
                'location_area': str(row['location_area']),
                'category_type': str(row['category_type']),
                'price_range': str(row['price_range']),
                'operating_hours': str(row.get('operating_hours', 'N/A')),
            }
            metadatas.append(metadata)
            ids.append(str(row['index']))
        logging.info(f"Prepared {len(documents)} documents for embedding.")
        return documents, metadatas, ids

# Create a singleton instance
data_loader = DataLoader()
