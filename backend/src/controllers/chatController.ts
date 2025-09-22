import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const handleChat = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://localhost:8000/api/chat', { message });
    const data = response.data;

    res.json({ response: data.response });
  } catch (error) {
    const err = error as Error;
    console.error("Python servis hatası:", err.message);
    res.status(500).json({ error: "Servis hatası" });
  }
};

export const getTools = async (req: Request, res: Response) => {
  try {
    const toolsPath = path.join(__dirname, '../../../nlp_service/tools.json');
    const toolsData = fs.readFileSync(toolsPath, 'utf-8');
    const tools = JSON.parse(toolsData);
    
    // Her araç için örnek puanlama verisi ekle
    const toolsWithRatings = tools.map((tool: any) => ({
      ...tool,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 arası random rating
      reviewCount: Math.floor(Math.random() * 50) + 5, // 5-55 arası review sayısı
      isFree: Math.random() > 0.4, // %60 ücretsiz, %40 ücretli
      category: getToolCategory(tool.use)
    }));
    
    res.json(toolsWithRatings);
  } catch (error) {
    console.error("Tools yükleme hatası:", error);
    res.status(500).json({ error: "Araçlar yüklenemedi" });
  }
};

function getToolCategory(use: string): string {
  const categories: { [key: string]: string } = {
    'Makale özeti': 'Araştırma',
    'Sunum hazırlama': 'Sunum',
    'Sınav sorusu oluşturma': 'Değerlendirme',
    'Literatür tarama': 'Araştırma',
    'Kaynak doğrulama': 'Araştırma',
    'Yazım geliştirme': 'Yazım',
    'Ders videosu hazırlama': 'Video',
    'Ders planı oluşturma': 'Planlama',
    'GPT tabanlı akademik asistan': 'Asistan',
    'Yazım ve dilbilgisi düzeltme': 'Yazım',
    'Paraphrasing ve özetleme': 'Yazım',
    'Eğitim materyali geliştirme': 'Planlama',
    'Etkileşimli sunum': 'Sunum',
    'Özet çıkarma': 'Araştırma',
    'Otomatik sunum slaytı oluşturma': 'Sunum'
  };
  
  return categories[use] || 'Genel';
}
