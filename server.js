const express = require('express');
const app = express();
const path = require('path'); // ✅ Importação necessária
require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Use .env

app.use(express.json());
app.use(express.static('public')); // ✅ HTML/CSS/JS ficam aqui

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // ✅ Caminho correto
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      capture_method: 'manual',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(4242, () => console.log('Servidor rodando na porta 4242'));
