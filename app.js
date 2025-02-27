const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { messages: [] });
});

// Endpoint para enviar mensajes al chatbot
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'cognitivecomputations/dolphin3.0-mistral-24b:free',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Chatbot App',
        },
      }
    );

    const botMessage = response.data.choices[0].message.content;
    res.render('index', { messages: [{ user: userMessage, bot: botMessage }] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error communicating with the chatbot API.');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
