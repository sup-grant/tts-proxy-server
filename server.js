const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST /tts 엔드포인트
app.post('/tts', async (req, res) => {
  console.log("📥 /tts 요청 수신됨");
  console.log("요청 내용:", req.body);

  try {
    const { text, voice_id, language } = req.body;

    // 유효성 검사
    if (!text || !voice_id || !language) {
      return res.status(400).send("text, voice_id, language는 필수입니다.");
    }

    // 외부 TTS API 호출
    const response = await fetch('https://internal-api.alttalk.ai/v1/voice/text_to_speech', {
      method: 'POST',
      headers: {
        Authorization: 'sk_1056a382acf24157b2416c0c7803e795',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice_id, language }),
    });

    console.log("✅ TTS API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ TTS API 에러 응답 내용:", errorText);
      return res.status(response.status).send("TTS API 요청 실패");
    }

    // 오디오 데이터 반환
    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error("❌ TTS 요청 중 오류 발생:", error.message);
    res.status(500).send("TTS 요청 실패");
  }
});

app.listen(PORT, () => {
  console.log(`🔉 프록시 서버가 포트 ${PORT}에서 실행 중`);
});
