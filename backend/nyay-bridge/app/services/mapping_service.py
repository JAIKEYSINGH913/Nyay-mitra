from sentence_transformers import SentenceTransformer, util
import numpy as np

class MappingService:
    def __init__(self):
        # Using InLegalBERT from OpenNyAI ecosystem via Hugging Face
        # For production, we can switch to a local path or specialized OpenNyAI library
        try:
            self.model = SentenceTransformer('law-ai/InLegalBERT')
        except Exception:
            # Fallback to a standard legal-bert if InLegalBERT fails to load
            self.model = SentenceTransformer('nlpaueb/legal-bert-base-uncased')

    def calculate_similarity(self, text1: str, text2: str):
        embeddings = self.model.encode([text1, text2], convert_to_tensor=True)
        
        # Cosine Similarity
        cosine_score = util.cos_sim(embeddings[0], embeddings[1])
        similarity = cosine_score.item()
        
        # Euclidean Distance for additional telemetry
        distance = np.linalg.norm(embeddings[0].cpu().numpy() - embeddings[1].cpu().numpy())
        
        return similarity, distance
