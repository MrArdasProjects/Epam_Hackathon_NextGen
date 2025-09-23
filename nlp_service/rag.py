import os
import json
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
import openai

# Ortam değişkenini yükle
load_dotenv()

# OpenAI API key'ini environment variable'dan al
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable bulunamadı!")

client = openai.OpenAI(api_key=api_key)  

TOOLS_PATH = Path("tools.json")
CACHE_PATH = Path("embedding_cache.json")

def detect_intent(message: str) -> str:
    prompt = (
        "Aşağıdaki mesaj bir selamlaşma mı, teşekkür mü, yoksa bir bilgi arayışı mı?\n"
        "Sadece şu üç cevaptan birini ver: SELAM, TEŞEKKÜR, SORU.\n"
        f"Mesaj: {message}"
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content.strip().upper()


# Cosine Similarity
def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Embedding al
def get_embedding(text: str) -> list:
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

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
            text_for_embedding = f"{tool['tool']}. {tool['academic_use']}. Keywords: {'; '.join(tool['keywords'])}."
            print(f"→ Embedding alınıyor: {key}")
            cache[key] = get_embedding(text_for_embedding)
            updated = True

        tool["embedding"] = cache[key]

    if updated:
        CACHE_PATH.write_text(json.dumps(cache, indent=2), encoding="utf-8")

    return tools

# Tool adını URL slug'a çevir
def tool_to_slug(tool_name: str) -> str:
    """Tool adını URL slug formatına çevirir"""
    import re
    # Küçük harfe çevir ve özel karakterleri tire ile değiştir
    slug = re.sub(r'[^a-z0-9]+', '-', tool_name.lower())
    # Başta ve sonunda tire varsa temizle
    slug = slug.strip('-')
    return slug

# Ana RAG fonksiyonu
def find_best_tool(user_input: str) -> str:
    
    intent = detect_intent(user_input)

    if intent == "SELAM":
        return "Merhaba! Size nasıl yardımcı olabilirim? 😊"
    elif intent == "TEŞEKKÜR":
        return "Rica ederim, her zaman yardımcı olmaktan mutluluk duyarım. 🙏"
    elif intent == "SORU":
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
        return "Bu konuda uygun bir araç bulamadım. 🔍\n\nTüm araçları görüntülemek için: http://localhost:3000/tools"

    # Tool slug'ını oluştur
    tool_slug = tool_to_slug(best_tool["tool"])
    internal_link = f"http://localhost:3000/tools/{tool_slug}"
    
    # Yeni format: hem internal hem external link
    response = f"""{best_tool["tool"]}: {best_tool["academic_use"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {best_tool["link"]}

💡 Detaylı sayfamızda videolu eğitimler ve kullanım rehberi bulabilirsiniz!"""
    
    return response
