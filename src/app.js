require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./api/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado');
  app.listen(3000, () => console.log('API rodando na porta 3000'));
}).catch(err => console.error('Erro ao conectar MongoDB:', err));
