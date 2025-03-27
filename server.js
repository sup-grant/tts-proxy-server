const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 필요
const cors = require('cors'); // 🔥 추가!
const app = express();
const PORT = 3000;


app.use(cors()); // 🔥 모든 요청 허용!
app.use(express.json());

app.post('/tts', async (req, res) => {
  const { text, voice_id, language } = req.body;

  try {
    const response = await fetch('https://internal-api.alttalk.ai/v1/voice/text_to_speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk_1056a382acf24157b2416c0c7803e795',
      },
      body: JSON.stringify({ text, voice_id, language })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'TTS API 호출 실패' });
    }

    const audioBuffer = await response.buffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('에러 발생:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`🔉 프록시 서버가 http://localhost:${PORT} 에서 실행 중`);
});
