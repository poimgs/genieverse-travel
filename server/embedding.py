import chromadb
from chromadb.utils import embedding_functions
import logging
from typing import List, Dict, Any, Optional
from config import COLLECTION_NAME

def get_embedding_function() -> embedding_functions.SentenceTransformerEmbeddingFunction:
    """Initializes and returns the Sentence Transformer embedding function."""
    from config import EMBEDDING_MODEL_NAME
    logging.info(f"Loading embedding model: {EMBEDDING_MODEL_NAME}")
    ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=EMBEDDING_MODEL_NAME)
    logging.info("Embedding model loaded.")
    return ef

def build_or_load_index(documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str], 
                       embedding_function: embedding_functions.SentenceTransformerEmbeddingFunction) -> Optional[chromadb.Collection]:
    """Builds a new ChromaDB index or loads an existing one."""
    from config import PERSIST_DIRECTORY, COLLECTION_NAME
    
    client = chromadb.PersistentClient(path=PERSIST_DIRECTORY)
    logging.info(f"Getting or creating Chroma collection: {COLLECTION_NAME}")
    try:
        collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=embedding_function,
            metadata={"hnsw:space": "cosine"}
        )
        
        # Check for population
        if collection.count() < len(documents):
            logging.warning(f"Collection '{COLLECTION_NAME}' exists but seems incomplete. Re-populating...")
            existing_ids = set(collection.get(include=[])['ids'])
            needs_adding_docs, needs_adding_metas, needs_adding_ids = [], [], []
            
            for doc, meta, id_ in zip(documents, metadatas, ids):
                if id_ not in existing_ids:
                    needs_adding_docs.append(doc)
                    needs_adding_metas.append(meta)
                    needs_adding_ids.append(id_)

            if needs_adding_ids:
                logging.info(f"Adding {len(needs_adding_ids)} new documents to the collection...")
                batch_size = 100
                for i in range(0, len(needs_adding_ids), batch_size):
                    batch_docs = needs_adding_docs[i:i+batch_size]
                    batch_metas = needs_adding_metas[i:i+batch_size]
                    batch_ids = needs_adding_ids[i:i+batch_size]
                    try:
                        collection.add(documents=batch_docs, metadatas=batch_metas, ids=batch_ids)
                        logging.info(f"Added batch {i//batch_size + 1}/{(len(needs_adding_ids) + batch_size - 1)//batch_size}")
                    except Exception as add_e:
                        logging.error(f"Error adding batch {i//batch_size + 1} to collection: {add_e}")
                logging.info("Finished adding documents.")
            else:
                logging.info("No new documents to add.")
        else:
            logging.info(f"Collection '{COLLECTION_NAME}' is up-to-date with {collection.count()} items.")

        return collection

    except Exception as e:
        logging.error(f"Failed to get or create collection: {e}")
        return None
