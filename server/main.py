import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import json
import time
import logging
from chromadb.utils import embedding_functions
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from rag import rag_pipeline_clarify
from data_loader import data_loader
from embedding import build_or_load_index

# --- FastAPI Setup ---

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount the images directory
app.mount("/images", StaticFiles(directory="data/images"), name="images")

class ConversationMessage(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    conversation: List[ConversationMessage]

@app.on_event("startup")
async def startup_event():
    """Initialize data on startup."""
    df = data_loader.load_data('data/genieverse-locations.csv')
    if df is None:
        raise RuntimeError("Failed to load location data during startup")
    logging.info("Successfully loaded location data during startup")

@app.post("/api/conversation")
async def process_conversation(request: ConversationRequest):
    """
    Process conversation and return relevant locations with clarifying questions.
    
    Returns:
    {
        "locations": [{"id": str, "score": float, "title": str, ...}],
        "clarifying_question": str
    }
    """
    try:
        conversation = [{"role": msg.role, "content": msg.content} for msg in request.conversation]
        
        if not conversation:
            return {
                "error": "No conversation provided",
                "locations": [],
                "clarifying_question": "Could you tell me what kind of place you're looking for in Singapore?"
            }
            
        # Use the already loaded data
        df = data_loader.df
        if df is None:
            raise HTTPException(status_code=500, detail="Location data not available")
            
        ef = get_embedding_function()
        documents, metadatas, ids = data_loader.prepare_documents()
        collection = build_or_load_index(documents, metadatas, ids, ef)
        
        if collection is None:
            raise HTTPException(status_code=500, detail="Failed to initialize search index")
            
        # Process conversation through RAG pipeline
        result = rag_pipeline_clarify(conversation, collection)
        
        return result
        
    except Exception as e:
        logging.error(f"Error processing conversation: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error"
        )

@app.get("/api/locations")
async def get_locations():
    """
    Get all locations from the dataset.
    
    Returns:
    {
        "locations": [{
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
        }]
    }
    """
    try:
        # Use the cached formatted locations
        locations = data_loader.get_formatted_locations()
        if not locations:
            raise HTTPException(status_code=500, detail="Location data not available")
            
        return {"locations": locations}
        
    except Exception as e:
        logging.error(f"Error getting locations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)