# 🤖 Akademik AI Asistanı

RAG (Retrieval-Augmented Generation) tabanlı akademik yapay zeka asistanı ve AI araçları kataloğu.

## ✨ Özellikler

- 🔍 **RAG Chatbot**: OpenAI ile güçlendirilmiş soru-cevap sistemi
- 🛠️ **AI Araçları Kataloğu**: 15+ akademik AI aracının keşfi
- ⭐ **Puanlama Sistemi**: Kullanıcı değerlendirmeleri ve yıldız sistemi
- 🔍 **Arama ve Filtreleme**: Kategori bazlı akıllı filtreleme
- 📱 **Responsive Tasarım**: Mobil uyumlu modern arayüz
- 🎨 **Modern UI**: React + Tailwind CSS ile şık tasarım

## 🏗️ Teknoloji Stack

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS** - Modern styling
- **React Router** - Sayfa yönetimi
- **Vite** - Hızlı build tool

### Backend
- **Node.js** + Express
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CORS** - Cross-origin desteği

### NLP Service
- **Python 3.8+** + Flask
- **OpenAI API** - GPT-3.5-turbo & Embeddings
- **NumPy** - Vector işlemleri
- **dotenv** - Environment management

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Python 3.8+
- OpenAI API Key

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/akademik-ai-asistani.git
cd akademik-ai-asistani
```

### 2. Environment dosyasını oluşturun
```bash
cd nlp_service
# .env dosyası oluşturun ve OpenAI API key'inizi ekleyin:
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Backend kurulumu
```bash
cd backend
npm install
npm run dev  # Port 5000'de çalışır
```

### 4. Frontend kurulumu
```bash
cd frontend
npm install
npm run dev  # Port 3000'de çalışır
```

### 5. NLP Service kurulumu
```bash
cd nlp_service
pip install -r requirements.txt
python app.py  # Port 8000'de çalışır
```

## 🌐 Kullanım

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **NLP Service**: http://localhost:8000

### Ana Sayfa
- Sohbete başlama butonu
- Araçları keşfet linki
- Modern landing page tasarımı

### Araçlar Kataloğu
- 15+ AI aracının kategorize listesi
- Arama çubuğu ile hızlı filtreleme
- Kategori bazlı filtreleme (Araştırma, Sunum, Yazım vs.)
- Her araç için yıldız puanlama sistemi
- Ücretsiz/Ücretli araç gösterimi

### Chatbot
- RAG tabanlı akıllı soru-cevap
- Intent detection (selamlaşma, teşekkür, soru)
- Akademik araç önerileri
- Cosine similarity ile en uygun araç bulma

## 📊 API Endpoints

### Backend API (Port 5000)
- `GET /api/tools` - AI araçları listesi (puanlama ve kategori bilgisi ile)
- `POST /api/chat` - RAG chatbot proxy

### NLP Service (Port 8000)
- `POST /api/chat` - RAG işleme servisi

## 🛠️ Desteklenen AI Araçları

### Araştırma Araçları
- **Consensus** - Makale özetleme
- **Elicit** - Literatür tarama
- **Scite.ai** - Kaynak doğrulama
- **Mindgrasp** - Özet çıkarma

### Sunum Araçları
- **Gamma.app** - Sunum hazırlama
- **SlidesAI** - Otomatik slayt oluşturma
- **ClassPoint** - Etkileşimli sunumlar
- **Pictory** - Ders videosu hazırlama

### Yazım Araçları
- **DeepL Write** - Yazım geliştirme
- **Grammarly** - Dilbilgisi düzeltme
- **QuillBot** - Paraphrasing ve özetleme

### Eğitim Araçları
- **Teachermatic** - Ders planı oluşturma
- **Eduaide.ai** - Eğitim materyali geliştirme
- **QuizGecko** - Sınav sorusu oluşturma
- **Scholar GPT** - Akademik GPT asistanı

## 🔧 Geliştirme

### Proje Yapısı
```
├── backend/          # Node.js API Gateway
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── routes/       # Route definitions
│   │   └── utils/        # Utility functions
│   └── package.json
├── frontend/         # React UI Application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── assets/       # Static assets
│   └── package.json
├── nlp_service/      # Python RAG System
│   ├── app.py           # Flask server
│   ├── rag.py           # RAG logic
│   ├── tools.json       # AI tools database
│   └── requirements.txt
└── README.md
```

### Yeni Araç Ekleme
1. `nlp_service/tools.json` dosyasına yeni araç bilgilerini ekleyin
2. Embedding cache otomatik olarak güncellenecektir
3. Frontend otomatik olarak yeni aracı gösterecektir

### Environment Variables
```bash
# nlp_service/.env
OPENAI_API_KEY=your_openai_api_key_here
DEBUG=True
DEFAULT_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-ada-002
```

## 🔒 Güvenlik

- API key'ler environment dosyalarında saklanır
- .env dosyaları .gitignore'da yer alır
- Hardcoded secret bilgi bulunmaz
- CORS koruması aktif

## 📈 Performans

- Embedding cache sistemi ile hızlı yanıt
- Cosine similarity ile verimli araç eşleştirme
- React optimizasyonları ile smooth UI
- Lazy loading ve code splitting

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Planlanan Özellikler

- [ ] Kullanıcı kayıt/giriş sistemi
- [ ] Araç detay sayfaları
- [ ] Gelişmiş puanlama algoritması
- [ ] Favori araçlar listesi
- [ ] E-posta bildirimleri
- [ ] Çoklu dil desteği
- [ ] Dark/Light theme
- [ ] Admin paneli

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🙏 Teşekkürler

- OpenAI API
- React ve TypeScript topluluğu
- Tüm açık kaynak katkıda bulunanlar

## 📞 İletişim

Proje hakkında sorularınız için:
- Issues kısmını kullanın
- Pull request gönderin
- Star vermeyi unutmayın! ⭐

---

Akademik hayatınızı kolaylaştırmak için tasarlandı. 🎓✨
