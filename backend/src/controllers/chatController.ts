import { Request, Response } from 'express';
import axios from 'axios';

export const handleChat = async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://localhost:8000/api/chat', { message });
    const data = response.data;

    res.json({ response: data.response });
  } catch (error) {
  const err = error as Error;
  console.error("Python servis hatası:", err.message);
}
};
