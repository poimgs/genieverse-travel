import json
import logging
from typing import List, Dict, Any, Optional
import chromadb
from config import openai_client, GENERATION_MODEL_NAME, TOP_K_RETRIEVAL
from openai import OpenAI

def generate_search_query(conversation_history: List[Dict[str, str]], llm_client: Optional[OpenAI]) -> str:
    """Uses LLM to generate a concise search query from conversation history."""
    if not llm_client:
        logging.warning("LLM client not available for query generation. Using last user message.")
        return conversation_history[-1]['content'] if conversation_history else ""

    prompt = f"""
Analyze the following conversation history between a User and an Assistant about finding locations in Singapore.
Extract the key criteria mentioned by the user (e.g., location type, area, atmosphere, price, audience, specific interests).
Generate a concise and focused search query summarizing the user's current request for retrieving relevant locations from a database.

Conversation History:
{json.dumps(conversation_history, indent=2)}

Concise Search Query:
"""
    try:
        response = llm_client.chat.completions.create(
            model=GENERATION_MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an AI assistant analyzing conversations to generate search queries for a location database."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, max_tokens=100
        )
        search_query = response.choices[0].message.content.strip()
        logging.info(f"Generated search query: {search_query}")
        return search_query
    except Exception as e:
        logging.error(f"Error generating search query with LLM: {e}")
        logging.warning("Falling back to using last user message as query.")
        return conversation_history[-1]['content'] if conversation_history else ""

def retrieve_locations(query: str, collection: chromadb.Collection, n_results: int = 5) -> Dict[str, List[Any]]:
    """Retrieves relevant documents and their distances from the ChromaDB collection."""
    if not collection:
        logging.error("Collection is not available for retrieval.")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

    logging.info(f"Retrieving top {n_results} locations for query: '{query}'")
    try:
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            include=['metadatas', 'distances']
        )
        results.setdefault('ids', [[]])
        results.setdefault('metadatas', [[]])
        results.setdefault('distances', [[]])
        return results
    except Exception as e:
        logging.error(f"Error during retrieval: {e}")
        return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

def format_retrieved_locations_for_response(results: Dict[str, List[Any]]) -> List[Dict[str, Any]]:
    """Formats retrieved locations into a list of dicts with id and score."""
    formatted_results = []
    for metadata, distance in zip(results['metadatas'][0], results['distances'][0]):
        formatted_results.append({
            'id': metadata['index'],
            'score': 1 - distance,  # Convert distance to similarity score
            'title': metadata['title']
        })
    return formatted_results

def generate_clarifying_question(conversation_history: List[Dict[str, str]], llm_client: Optional[OpenAI]) -> str:
    """Generates a question to clarify user needs based on the conversation."""
    if not llm_client:
        return "Could you please provide more details about what you're looking for?"

    prompt = f"""
Based on the following conversation history between a User and an Assistant about finding locations in Singapore,
generate a single, focused clarifying question that would help better understand the user's preferences or requirements.

Conversation History:
{json.dumps(conversation_history, indent=2)}

Generate a natural-sounding clarifying question that would help narrow down the search or better understand the user's needs.
The question should be specific and relevant to what has been discussed.
"""
    try:
        response = llm_client.chat.completions.create(
            model=GENERATION_MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an AI assistant helping users find locations in Singapore."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error generating clarifying question with LLM: {e}")
        return "Could you please provide more details about what you're looking for?"

def rag_pipeline_clarify(conversation_history: List[Dict[str, str]], collection: chromadb.Collection) -> Dict[str, Any]:
    """
    Runs the RAG pipeline to retrieve locations and generate a clarifying question.

    Returns:
        A dictionary containing:
        - 'retrieved_locations': List of dicts [{'id': str, 'score': float, 'title': str}]
        - 'clarifying_question': str
    """
    # Generate search query from conversation
    search_query = generate_search_query(conversation_history, openai_client)
    
    # Retrieve relevant locations
    retrieval_results = retrieve_locations(search_query, collection, TOP_K_RETRIEVAL)
    
    # Format locations for response
    formatted_locations = format_retrieved_locations_for_response(retrieval_results)
    
    # Generate clarifying question
    clarifying_question = generate_clarifying_question(conversation_history, openai_client)
    
    return {
        'retrieved_locations': formatted_locations,
        'clarifying_question': clarifying_question
    }
