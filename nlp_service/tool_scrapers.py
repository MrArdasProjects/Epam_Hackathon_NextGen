import os
import json
import requests
from bs4 import BeautifulSoup
from pathlib import Path
from typing import Dict, List
import time
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
from duckduckgo_search import DDGS
import openai

load_dotenv()

# Artık web scraping kullanmıyoruz - sadece web search + ChatGPT

def search_web_for_consensus(question: str, language: str = "tr") -> str:
    """Web'de Consensus hakkında arama yapar ve ChatGPT ile özetler"""
    try:
        # Search query hazırla
        if language == "en":
            search_query = f"Consensus.app {question} AI research tool academic papers"
        else:
            search_query = f"Consensus.app {question} yapay zeka araştırma aracı akademik makaleler"
        
        print(f"🔍 Web search: {search_query}")
        
        # DuckDuckGo ile arama
        with DDGS() as ddgs:
            results = list(ddgs.text(search_query, max_results=5))
        
        if not results:
            return ""
        
        # Arama sonuçlarını birleştir
        search_content = ""
        for result in results:
            search_content += f"Title: {result.get('title', '')}\n"
            search_content += f"Summary: {result.get('body', '')}\n"
            search_content += f"URL: {result.get('href', '')}\n\n"
        
        # ChatGPT ile özetle
        api_key = os.getenv("OPENAI_API_KEY")
        client = openai.OpenAI(api_key=api_key)
        
        if language == "en":
            prompt = f"""Based on the following web search results about Consensus.app, provide a short, clear and helpful answer to the user's question: "{question}"

Web search results:
{search_content}

Requirements:
- Keep the answer short and concise (max 3-4 sentences)
- Focus specifically on Consensus.app
- Be helpful and accurate
- If you can't find specific information, say so briefly

Answer:"""
        else:
            prompt = f"""Aşağıdaki Consensus.app hakkındaki web arama sonuçlarına dayanarak, kullanıcının sorusuna kısa, net ve yardımcı bir yanıt verin: "{question}"

Web arama sonuçları:
{search_content}

Gereksinimler:
- Yanıtı kısa ve öz tutun (maksimum 3-4 cümle)
- Özellikle Consensus.app'e odaklanın
- Yardımcı ve doğru olun
- Spesifik bilgi bulamazsanız bunu kısaca belirtin

Yanıt:"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=150
        )
        
        answer = response.choices[0].message.content.strip()
        print(f"✅ Web search answer generated")
        return answer
        
    except Exception as e:
        print(f"❌ Web search error: {e}")
        return ""

def get_consensus_answer(question: str, language: str = "tr") -> str:
    """Consensus hakkında soru-cevap - SADECE web search + ChatGPT"""
    
    try:
        # Direkt web search yap - web sitesi scraping'i yok
        web_answer = search_web_for_consensus(question, language)
        
        if web_answer and len(web_answer.strip()) > 10:
            # Web search başarılı
            if language == "en":
                return f"""{web_answer}

🌐 **Official site:** https://consensus.app"""
            else:
                return f"""{web_answer}

🌐 **Resmi site:** https://consensus.app"""
        else:
            # Web search başarısızsa, basit hata mesajı
            if language == "en":
                return f"""I couldn't find specific information about that. Please try asking a more specific question about Consensus.app or visit the official website.

🌐 **Visit:** https://consensus.app"""
            else:
                return f"""Bu konuda spesifik bilgi bulamadım. Lütfen Consensus.app hakkında daha spesifik bir soru sorun veya resmi web sitesini ziyaret edin.

🌐 **Ziyaret edin:** https://consensus.app"""
        
    except Exception as e:
        print(f"❌ Consensus Answer Error: {e}")
        if language == "en":
            return """I'm having trouble finding information right now. Please visit the official Consensus.app website.

🌐 **Visit:** https://consensus.app"""
        else:
            return """Şu anda bilgi bulmakta sorun yaşıyorum. Lütfen resmi Consensus.app web sitesini ziyaret edin.

🌐 **Ziyaret edin:** https://consensus.app"""

if __name__ == "__main__":
    # Test
    answer = get_consensus_answer("Consensus nedir ve nasıl çalışır?", "tr")
    print(answer)
