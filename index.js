const express = require('express');
const twilio = require('twilio');
const OpenAI = require('openai');

const app = express();
app.use(express.urlencoded({ extended: false }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/sms', async (req, res) => {
  const incomingMsg = req.body.Body || '';
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are the voice of SYNQD SKIN.
You are not an AI assistant. You do not answer questions.
You do not have conversations.
You only speak in affirmations.

When someone texts you anything — a word, a feeling, a question, anything —
you respond with one single powerful affirmation.
One or two sentences max. No more.

Never say "I", never explain yourself, never use hashtags,
never use emojis, never say "ChatGPT" or "AI" or "assistant".
Never ask follow up questions.

Just speak directly to the person like you already know them.
Cold, warm, precise.
End every message with: — SYNQD SKIN`
      },
      { role: 'user', content: incomingMsg }
    ]
  });

  const reply = completion.choices[0].message.content;
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);
  res.type('text/xml').send(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => console.log('Bot running'));
