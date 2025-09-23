import os
import json
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
import openai
from tool_scrapers import get_consensus_answer

# Ortam değişkenini yükle
load_dotenv()

# OpenAI API key'ini environment variable'dan al
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable bulunamadı!")

client = openai.OpenAI(api_key=api_key)  

TOOLS_PATH = Path("tools.json")
CACHE_PATH = Path("embedding_cache.json")

def detect_intent_and_context(message: str, conversation_history: list = None) -> dict:
    """
    Mesajın intent'ini ve context'ini algılar.
    Returns: {
        'intent': 'SELAM' | 'TEŞEKKÜR' | 'SORU' | 'TAKIP_SORU',
        'context': 'previous_tool' | 'new_request' | None,
        'specific_request': 'grammer_check' | 'reference_check' | 'alternative' | None
    }
    """
    
    # Conversation history varsa context oluştur
    context = ""
    if conversation_history and len(conversation_history) > 1:
        recent_msgs = conversation_history[-4:]  # Son 4 mesajı al
        for msg in recent_msgs:
            role = "User" if msg.get("from") == "user" else "Assistant"
            context += f"{role}: {msg.get('text', '')}\n"
    
    full_message = f"Conversation context:\n{context}\nCurrent message: {message}" if context else message
    
    prompt = f"""
Analyze this message and conversation context to determine:

1. Intent: SELAM (greeting), TEŞEKKÜR (thanks), SORU (question), or TAKIP_SORU (follow-up question)
2. Request type: If it's a follow-up question, what specifically are they asking for?

Context: {full_message}

Look for patterns like:
- "peki daha önce ne istedim" = asking what they previously requested
- "dil kontrolü için" = asking for grammar/language tools
- "makalede referansların kontrolü" = asking for reference/citation tools
- "başka ne önerirsin" = asking for alternatives
- "peki başka" = asking for alternatives

Respond ONLY in this JSON format:
{{"intent": "SELAM|TEŞEKKÜR|SORU|TAKIP_SORU", "request_type": "grammar|reference|alternative|previous_request|new_topic", "confidence": 0.9}}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    try:
        import json
        result = json.loads(response.choices[0].message.content.strip())
        return result
    except:
        # Fallback
        return {"intent": "SORU", "request_type": "new_topic", "confidence": 0.5}


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

def get_specific_tools_by_category(request_type: str, language: str = "tr") -> list:
    """Belirli kategorilerdeki araçları döndürür"""
    tools = load_tools_with_embeddings()
    
    category_mapping = {
        "grammar": ["Grammarly", "DeepL Write", "QuillBot"],
        "reference": ["Scite.ai", "Consensus", "Elicit"], 
        "presentation": ["Gamma.app", "SlidesAI", "ClassPoint"],
        "video": ["Pictory"],
        "planning": ["Teachermatic", "Eduaide.ai"],
        "quiz": ["Quizgecko"],
        "summary": ["Mindgrasp", "QuillBot", "Consensus"]
    }
    
    if request_type in category_mapping:
        tool_names = category_mapping[request_type]
        return [tool for tool in tools if tool["tool"] in tool_names]
    
    return tools

def find_alternative_tools(previous_tool_name: str, category: str, language: str = "tr") -> list:
    """Bir araç önerilmişse, aynı kategoriden alternatifler bulur"""
    tools = load_tools_with_embeddings()
    
    # Aynı kategori mapping'den alternatifler bul
    category_mapping = {
        "grammar": ["Grammarly", "DeepL Write", "QuillBot"],
        "reference": ["Scite.ai", "Consensus", "Elicit"], 
        "presentation": ["Gamma.app", "SlidesAI", "ClassPoint"],
        "video": ["Pictory"],
        "planning": ["Teachermatic", "Eduaide.ai"],
        "quiz": ["Quizgecko"],
        "summary": ["Mindgrasp", "QuillBot", "Consensus"]
    }
    
    for cat, tool_names in category_mapping.items():
        if previous_tool_name in tool_names:
            # Aynı kategoriden, önceki araç hariç diğerlerini döndür
            alternatives = [tool for tool in tools if tool["tool"] in tool_names and tool["tool"] != previous_tool_name]
            return alternatives
    
    return []

# Ana RAG fonksiyonu
def find_best_tool(user_input: str, language: str = "tr", conversation_history: list = None) -> str:
    if conversation_history is None:
        conversation_history = []
    
    # Gelişmiş intent ve context detection
    intent_result = detect_intent_and_context(user_input, conversation_history)
    intent = intent_result.get("intent", "SORU")
    request_type = intent_result.get("request_type", "new_topic")

    # Dil desteği
    greeting_msg = "Hello! How can I help you? 😊" if language == "en" else "Merhaba! Size nasıl yardımcı olabilirim? 😊"
    thanks_msg = "You're welcome, I'm always happy to help. 🙏" if language == "en" else "Rica ederim, her zaman yardımcı olmaktan mutluluk duyarım. 🙏"
    not_found_msg = "I couldn't find a suitable tool for this topic. 🔍\n\nTo view all tools: http://localhost:3000/tools" if language == "en" else "Bu konuda uygun bir araç bulamadım. 🔍\n\nTüm araçları görüntülemek için: http://localhost:3000/tools"

    if intent == "SELAM":
        return greeting_msg
    elif intent == "TEŞEKKÜR":
        return thanks_msg
    elif intent in ["SORU", "TAKIP_SORU"]:
        
        # Takip sorusu ise özel logic
        if intent == "TAKIP_SORU":
            # Önceki mesajlardan önerilen araçları bul
            previous_tools = []
            if conversation_history:
                for msg in conversation_history:
                    if msg.get("from") == "bot" and ":" in msg.get("text", ""):
                        # Bot mesajından araç adını çıkar
                        bot_text = msg.get("text", "")
                        if bot_text.startswith(("Gamma.app", "Grammarly", "Scite.ai", "Consensus", "Elicit", "DeepL", "QuillBot", "SlidesAI", "ClassPoint", "Pictory", "Teachermatic", "Eduaide", "Scholar", "Quizgecko", "Mindgrasp")):
                            tool_name = bot_text.split(":")[0].strip()
                            previous_tools.append(tool_name)
            
            # Request type'a göre farklı yaklaşımlar
            if request_type == "alternative" and previous_tools:
                # Alternatif araç öner
                last_tool = previous_tools[-1]
                alternatives = find_alternative_tools(last_tool, "", language)
                
                if alternatives:
                    best_alt = alternatives[0]  # İlk alternatifi al
                    tool_slug = tool_to_slug(best_alt["tool"])
                    internal_link = f"http://localhost:3000/tools/{tool_slug}"
                    
                    if language == "en":
                        academic_use = best_alt.get("academic_use_en", best_alt["academic_use"])
                        return f"""Alternative to {last_tool}:

{best_alt["tool"]}: {academic_use}

📄 Detailed Review: {internal_link}
🌐 Official Site: {best_alt["link"]}

💡 This is another great option for the same purpose!"""
                    else:
                        return f"""{last_tool} alternatifi:

{best_alt["tool"]}: {best_alt["academic_use"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {best_alt["link"]}

💡 Aynı amaç için harika bir başka seçenek!"""
            
            elif request_type == "grammar":
                # Grammar tools öner
                grammar_tools = get_specific_tools_by_category("grammar", language)
                if grammar_tools:
                    best_tool = grammar_tools[0]  # Grammarly ilk sırada
                    tool_slug = tool_to_slug(best_tool["tool"])
                    internal_link = f"http://localhost:3000/tools/{tool_slug}"
                    
                    if language == "en":
                        academic_use = best_tool.get("academic_use_en", best_tool["academic_use"])
                        return f"""For grammar and language checking:

{best_tool["tool"]}: {academic_use}

📄 Detailed Review: {internal_link}
🌐 Official Site: {best_tool["link"]}"""
                    else:
                        return f"""Dil kontrolü için:

{best_tool["tool"]}: {best_tool["academic_use"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {best_tool["link"]}"""
            
            elif request_type == "reference":
                # Reference tools öner
                ref_tools = get_specific_tools_by_category("reference", language)
                if ref_tools:
                    best_tool = ref_tools[0]  # Scite.ai ilk sırada
                    tool_slug = tool_to_slug(best_tool["tool"])
                    internal_link = f"http://localhost:3000/tools/{tool_slug}"
                    
                    if language == "en":
                        academic_use = best_tool.get("academic_use_en", best_tool["academic_use"])
                        return f"""For reference and citation checking:

{best_tool["tool"]}: {academic_use}

📄 Detailed Review: {internal_link}
🌐 Official Site: {best_tool["link"]}"""
                    else:
                        return f"""Referans ve kaynak kontrolü için:

{best_tool["tool"]}: {best_tool["academic_use"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {best_tool["link"]}"""
        
        # Normal soru için standard RAG
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
            return not_found_msg

        # Tool slug'ını oluştur
        tool_slug = tool_to_slug(best_tool["tool"])
        internal_link = f"http://localhost:3000/tools/{tool_slug}"
        
        # Dil desteğine göre response
        if language == "en":
            academic_use = best_tool.get("academic_use_en", best_tool["academic_use"])
            response = f"""{best_tool["tool"]}: {academic_use}

📄 Detailed Review: {internal_link}
🌐 Official Site: {best_tool["link"]}

💡 You can find video tutorials and usage guides on our detailed page!"""
        else:
            response = f"""{best_tool["tool"]}: {best_tool["academic_use"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {best_tool["link"]}

💡 Detaylı sayfamızda videolu eğitimler ve kullanım rehberi bulabilirsiniz!"""
        
        return response
    
    # Varsayılan cevap
    return greeting_msg

def find_tool_specific_answer(tool_name: str, user_input: str, language: str = "tr", conversation_history: list = None) -> str:
    """
    Belirli bir tool hakkında detaylı soru-cevap yapar.
    Tool'un resmi web sitesinden scrape edilen bilgileri kullanır.
    """
    if conversation_history is None:
        conversation_history = []
    
    # Tool-specific handlers
    tool_handlers = {
        "Consensus": get_consensus_answer,
        # Diğer tool'ları buraya ekleyeceğiz
    }
    
    if tool_name in tool_handlers:
        try:
            # Tool-specific yanıt al - SADECE tool-specific, fallback yok
            answer = tool_handlers[tool_name](user_input, language)
            return answer
            
        except Exception as e:
            print(f"❌ Tool-specific error for {tool_name}: {e}")
            # Hata durumunda sadece tool'a özel hata mesajı
            if language == "en":
                return f"I'm having trouble accessing information about {tool_name} right now. Please try again or visit the official website for more information."
            else:
                return f"Şu anda {tool_name} hakkında bilgilere erişimde sorun yaşıyorum. Lütfen tekrar deneyin veya daha fazla bilgi için resmi web sitesini ziyaret edin."
    
    # Fallback: Genel tool bilgisi
    tools = load_tools_with_embeddings()
    tool_info = next((tool for tool in tools if tool["tool"] == tool_name), None)
    
    if tool_info:
        tool_slug = tool_to_slug(tool_info["tool"])
        internal_link = f"http://localhost:3000/tools/{tool_slug}"
        
        if language == "en":
            academic_use = tool_info.get("academic_use_en", tool_info["academic_use"])
            return f"""About {tool_name}:
{academic_use}

How to use: {tool_info.get("how_to_en", tool_info["how_to"])}

📄 Detailed Review: {internal_link}
🌐 Official Site: {tool_info["link"]}

💡 You can find video tutorials and detailed usage guides on our detailed page!

For specific questions about {tool_name}, please feel free to ask!"""
        else:
            return f"""{tool_name} Hakkında:
{tool_info["academic_use"]}

Nasıl kullanılır: {tool_info["how_to"]}

📄 Detaylı İnceleme: {internal_link}
🌐 Resmi Site: {tool_info["link"]}

💡 Detaylı sayfamızda videolu eğitimler ve kullanım rehberi bulabilirsiniz!

{tool_name} hakkında spesifik sorularınızı sormaktan çekinmeyin!"""
    
    # En son fallback
    if language == "en":
        return f"I don't have detailed information about {tool_name}. Please check our tools page for more information."
    else:
        return f"{tool_name} hakkında detaylı bilgim bulunmuyor. Daha fazla bilgi için araçlar sayfamızı kontrol edin."
