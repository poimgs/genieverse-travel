import os
import logging
import openai
from typing import Optional

def initialize_openai_client() -> Optional[openai.OpenAI]:
    """
    Initialize and return the OpenAI client.
    Returns None if the API key is not found or invalid.
    """
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables.")
        client = openai.OpenAI()  # Uses api_key from environment
        return client
    except ValueError as e:
        logging.error(f"OpenAI API Key Error: {e}")
        logging.warning("LLM-based query preprocessing and clarification will not work without an API key.")
        return None

# Create a global client instance
client = initialize_openai_client()
