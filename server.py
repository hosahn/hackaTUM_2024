from datasets import load_dataset

docs = load_dataset("bunkalab/medium-sample-technology")["train"]["title"]

from sentence_transformers import SentenceTransformer
embedding_model = SentenceTransformer(model_name_or_path="all-MiniLM-L6-v2")

# Load Projection Model
import umap
projection_model = umap.UMAP(
                n_components=2,
                random_state=42)

from bunkatopics import Bunka

bunka = Bunka(embedding_model=embedding_model, 
            projection_model=projection_model)  # the language is automatically detected, make sure the embedding model is adapted

# Fit Bunka to your text data
bunka.fit(docs)