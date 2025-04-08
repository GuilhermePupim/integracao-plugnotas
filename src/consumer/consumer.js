require('dotenv').config();
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;
const { receiveFromQueue, deleteMessage } = require('../services/sqsService');
const { findCepById, updateCepData } = require('../services/mongoService');
const { getCepData } = require('../services/viaCepService');

// Conecta ao MongoDB ANTES de começar o consumo da fila
console.log('MONGO_URI carregada:', mongoUri);
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000,  // Aumenta o tempo de espera para conexão com o MongoDB
})
.then(() => {
  console.log('MongoDB conectado no consumer');
  runConsumer(); // Só inicia o consumer após a conexão
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
        console.log(`Procurando CEP com ID: ${id}`); // Log para verificar o ID
        const entry = await findCepById(id);
        
        if (!entry) {
          console.log(`CEP com ID ${id} não encontrado no banco de dados`);
          await updateCepData(id, 'REJEITADO');  // Marca como REJEITADO caso não encontre
          continue;  // Ignora a mensagem e segue para a próxima
        }

        const cleanCep = entry.cep.replace(/\D/g, '');  // Limpa o CEP
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
        // Caso ocorra algum erro no processo, marca como REJEITADO
        console.error(`Erro ao processar CEP ${id}: ${err.message}`);
        await updateCepData(id, 'REJEITADO');
      } finally {
        await deleteMessage(message.ReceiptHandle); // Deleta a mensagem após o processamento
      }
    }
  }
};
