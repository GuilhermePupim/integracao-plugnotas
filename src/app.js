require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./api/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);


console.log('AWS Region:', process.env.AWS_REGION);
console.log('SQS Queue URL:', process.env.SQS_QUEUE_URL);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000 
})
  .then(() => {
    console.log('MongoDB conectado');
    
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err);
  });
