import os
from dotenv import load_dotenv
import logging
import openai

# Load environment variables
load_dotenv()

# File and Directory Configuration
CSV_PATH = os.getenv('CSV_PATH', 'genieverse-locations.csv')
PERSIST_DIRECTORY = os.getenv('PERSIST_DIRECTORY', './chroma_db_locations')
COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'genieverse_locations')

# Model Configuration
EMBEDDING_MODEL_NAME = os.getenv('EMBEDDING_MODEL_NAME', 'all-MiniLM-L6-v2')
GENERATION_MODEL_NAME = os.getenv('GENERATION_MODEL_NAME', 'gpt-4o-mini')
TOP_K_RETRIEVAL = int(os.getenv('TOP_K_RETRIEVAL', '5'))

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Setup OpenAI Client
try:
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables.")
    openai_client = openai.OpenAI()
except ValueError as e:
    logging.error(f"OpenAI API Key Error: {e}")
    logging.warning("LLM-based query preprocessing and clarification will not work without an API key.")
    openai_client = None
