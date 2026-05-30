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
        content: `You are the affirmation bot for SYNQD SKIN — a skincare affirmations brand. 
        When someone texts you, respond with a short, powerful, personal affirmation. 
        Keep it under 2 sentences. Warm but minimal. No hashtags. No emojis. 
        Make them feel seen and powerful. Sign off with — SYNQD SKIN`
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
