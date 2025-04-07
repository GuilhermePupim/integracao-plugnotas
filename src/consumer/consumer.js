require('dotenv').config();
const { receiveFromQueue, deleteMessage } = require('../services/sqsService');
const { findCepById, updateCepData } = require('../services/mongoService');
const { getCepData } = require('../services/viaCepService');

const runConsumer = async () => {
  console.log('Consumidor iniciado...');
  while (true) {
    const message = await receiveFromQueue();
    if (message) {
      const id = message.Body;
      try {
        const entry = await findCepById(id);
        const data = await getCepData(entry.cep);
        await updateCepData(id, 'CONCLUIDO', data);
      } catch (err) {
        await updateCepData(id, 'REJEITADO');
      } finally {
        await deleteMessage(message.ReceiptHandle);
      }
    }
  }
};

runConsumer();
