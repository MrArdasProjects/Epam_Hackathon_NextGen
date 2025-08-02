import openai
import json
import numpy as np
from pathlib import Path

openai.api_key_path = ".env"  # .env dosyasında OPENAI_API_KEY olacak

TOOLS_PATH = Path("tools.json")
CACHE_PATH = Path("embedding_cache.json")

# Cosine Similarity
def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Embedding al
def get_embedding(text: str) -> list:
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response["data"][0]["embedding"]

# tools.json + cache.json → tüm araç embedding'lerini yükle
def load_tools_with_embeddings():
    tools = json.loads(TOOLS_PATH.read_text(encoding="utf-8"))

    if CACHE_PATH.exists():
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    else:
        cache = {}

    updated = False
    for tool in tools:
        key = tool["tool"]
        if key not in cache:
            text_for_embedding = " ".join(tool["keywords"])
            cache[key] = get_embedding(text_for_embedding)
            updated = True

        tool["embedding"] = cache[key]

    if updated:
        CACHE_PATH.write_text(json.dumps(cache, indent=2), encoding="utf-8")

    return tools

# Ana RAG fonksiyonu
def find_best_tool(user_input: str) -> str:
    tools = load_tools_with_embeddings()
    input_emb = get_embedding(user_input)

    best_tool = None
    best_score = -1

    for tool in tools:
        sim = cosine_similarity(input_emb, tool["embedding"])
        if sim > best_score:
            best_score = sim
            best_tool = tool

    if best_score < 0.75:
        return "Bu konuda uygun bir araç bulamadım."

    return f'{best_tool["tool"]}: {best_tool["academic_use"]} → {best_tool["link"]}'
