const express = require('express');
const router = express.Router();
const CepEntry = require('../models/CepEntry');
const { sendToQueue } = require('../services/sqsService');

router.post('/cep', async (req, res) => {
  const { cep } = req.body;
  try {
    const entry = await CepEntry.create({ cep });
    await sendToQueue(entry._id.toString());
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar e enviar para fila' });
  }
});

module.exports = router;
