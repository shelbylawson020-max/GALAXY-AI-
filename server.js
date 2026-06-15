import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Weather endpoint
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  try {
    const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    const data = await r.json();
    const current = data.current_condition[0];
    res.json({
      city,
      temp_c: current.temp_C,
      temp_f: current.temp_F,
      feels_c: current.FeelsLikeC,
      feels_f: current.FeelsLikeF,
      desc: current.weatherDesc[0].value,
      humidity: current.humidity,
      wind_kmph: current.windspeedKmph,
      visibility: current.visibility,
    });
  } catch (e) {
    res.status(500).json({ error: 'Could not fetch weather' });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { messages, model } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not set on server' });
  }

  try {
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', 
      day: 'numeric', hour: '2-digit', minute: '2-digit', 
      timeZoneName: 'short' 
    });

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Galaxy AI, a powerful, friendly, and knowledgeable assistant. 

The current date and time is: ${timeStr}

You can help with absolutely anything:
- Answer questions on any topic
- Write code in any language
- Do math calculations
- Help with creative writing, stories, poems
- Give advice and recommendations  
- Explain complex topics simply
- Translate languages
- Summarize text
- Help plan trips, meals, schedules
- Weather (users can ask "weather in [city]" and the app will show it)
- Current time and date (you always know it — it's ${timeStr})

Always be helpful, friendly, accurate and thorough. Never say you don't know the current time or date.`
          },
          ...messages
        ],
        stream: true,
        max_tokens: 4096,
        temperature: 0.7
      })
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({ error: err?.error?.message || 'Groq API error' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    upstream.body.pipe(res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Galaxy AI running on port ${PORT}`));
