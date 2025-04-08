require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;
const { receiveFromQueue, deleteMessage } = require('../services/sqsService');
const { findCepById, updateCepData } = require('../services/mongoService');
const { getCepData } = require('../services/viaCepService');


console.log('MONGO_URI carregada:', mongoUri);
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,  
})
.then(() => {
  console.log('MongoDB conectado no consumer');
  runConsumer(); 
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB no consumer:', err);
  process.exit(1);
});

const runConsumer = async () => {
  console.log('Consumidor iniciado...');
  while (true) {
    const message = await receiveFromQueue();
    if (message) {
      const id = message.Body;
      try {
        console.log(`Procurando CEP com ID: ${id}`); 
        const entry = await findCepById(id);
        
        if (!entry) {
          console.log(`CEP com ID ${id} não encontrado no banco de dados`);
          await updateCepData(id, 'REJEITADO');  
          continue;  
        }

        const cleanCep = entry.cep.replace(/\D/g, '');  
        const data = await getCepData(cleanCep);

        if (!data) {
          console.log(`Erro ao obter dados do CEP ${cleanCep}`);
          await updateCepData(id, 'REJEITADO');
          continue;
        }

        console.log('Dados do CEP retornados:', data);
        await updateCepData(id, 'CONCLUIDO', data);
        console.log(`CEP ${cleanCep} atualizado com sucesso!`);

      } catch (err) {
        
        console.error(`Erro ao processar CEP ${id}: ${err.message}`);
        await updateCepData(id, 'REJEITADO');
      } finally {
        await deleteMessage(message.ReceiptHandle); 
      }
    }
  }
};
