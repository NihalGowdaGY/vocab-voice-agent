export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { word, sentence } = req.body;

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: 'You are a friendly, concise vocabulary tutor. Given a target word and a sentence the user spoke, tell them in 1-2 short sentences whether they used the word correctly, and briefly correct or praise them.' },
        { role: 'user', content: `Word: "${word}". Sentence: "${sentence}"` }
      ],
      max_tokens: 100
    })
  });

  const data = await groqRes.json();
  console.error('GROQ RESPONSE:', JSON.stringify(data));
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
  res.status(200).json({ reply });
}