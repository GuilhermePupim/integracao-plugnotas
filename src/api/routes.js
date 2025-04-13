const express = require('express');
const router = express.Router();
const CepEntry = require('../models/CepEntry');
const { sendToQueue } = require('../services/sqsService');

const isValidCep = (cep) => {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
};

const formatCep = (cep) => {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
};

router.post('/cep', async (req, res) => {
  let { cep } = req.body;

  if (!isValidCep(cep)) {
    return res.status(400).json({ error: 'Formato de CEP inválido. O formato correto é 00000-000 ou 00000000.' });
  }

  
  cep = formatCep(cep);

  try {
    
    const entry = await CepEntry.create({ cep, status: 'PENDENTE' });
    await sendToQueue(entry._id.toString());
    res.status(201).json(entry);
  } catch (err) {
    console.error('Erro ao salvar e enviar para fila:', err.message);
    res.status(500).json({ error: 'Erro ao salvar e enviar para fila', details: err.message });
  }
});


router.get('/cep', async (req, res) => {
  try {
    const entries = await CepEntry.find();
    res.status(200).json(entries);
  } catch (err) {
    console.error('Erro ao recuperar os CEPs:', err.message);
    res.status(500).json({ error: 'Erro ao recuperar os CEPs', details: err.message });
  }
});


router.get('/cep/:id', async (req, res) => {
  try {
    const entry = await CepEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    res.status(200).json(entry);
  } catch (err) {
    console.error('Erro ao recuperar o CEP:', err.message);
    res.status(500).json({ error: 'Erro ao recuperar o CEP', details: err.message });
  }
});


router.put('/cep/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const entry = await CepEntry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } 
    );
    if (!entry) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    res.status(200).json(entry);
  } catch (err) {
    console.error('Erro ao atualizar o status do CEP:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar o status do CEP', details: err.message });
  }
});


router.delete('/cep/:id', async (req, res) => {
  try {
    const entry = await CepEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    res.status(200).json({ message: 'CEP excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir o CEP:', err.message);
    res.status(500).json({ error: 'Erro ao excluir o CEP', details: err.message });
  }
});

module.exports = router;
