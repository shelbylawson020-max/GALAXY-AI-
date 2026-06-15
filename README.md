# 🌌 Galaxy AI

A beautiful AI chat website powered by Groq (free & fast). Users just open it and chat — no signup, no API key needed from them.

---

## ✅ Step 1 — Get your FREE Groq API Key

1. Go to **https://console.groq.com**
2. Sign up (free, no credit card)
3. Click **API Keys** → **Create API Key**
4. Copy it — looks like: `gsk_xxxxxxxxxxxxxxxxxxxx`

---

## ✅ Step 2 — Deploy to Render (free hosting)

1. Go to **https://render.com** and sign up free
2. Click **New +** → **Web Service**
3. Choose **Deploy from a Git repo** (or upload manually)
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node
5. Under **Environment Variables**, add:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_key_here`
6. Click **Deploy**

Your site will be live at `https://your-app.onrender.com` in ~2 minutes!

---

## 📁 File Structure

```
galaxy-ai/
├── server.js        ← Node.js backend (holds your Groq key)
├── package.json     ← Dependencies
└── public/
    └── index.html   ← The chat website
```

---

## 🧠 AI Models Available (selectable in UI)

| Model | Speed | Best for |
|-------|-------|----------|
| Llama 3.3 70B | Fast | General use (default) |
| Llama 3.1 8B | Fastest | Quick answers |
| Mixtral 8x7B | Fast | Reasoning & code |

All free on Groq's free tier.

---

## 🔒 How it works

- Users visit your site → chat normally
- Your server forwards messages to Groq using YOUR key
- Users never see the key — it lives only on your server
- Chat history saved in each user's browser localStorage
