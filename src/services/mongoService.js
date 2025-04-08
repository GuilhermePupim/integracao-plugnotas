const CepEntry = require('../models/CepEntry');

// Função para encontrar o CEP pelo ID
async function findCepById(id) {
  try {
    const entry = await CepEntry.findById(id);
    if (!entry) {
      throw new Error(`CEP com ID ${id} não encontrado.`);
    }
    return entry;
  } catch (err) {
    console.error(`Erro ao encontrar o CEP por ID: ${err.message}`);
    throw err;
  }
}

// Função para atualizar o registro do CEP
async function updateCepData(id, status, data = null) {
  const updateData = { status };

  // Se houver dados do CEP, adiciona ao campo 'data'
  if (data) {
    updateData.data = data;
  }

  try {
    const updatedEntry = await CepEntry.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEntry) {
      throw new Error(`Erro ao atualizar o CEP com ID ${id}`);
    }
    return updatedEntry;
  } catch (err) {
    console.error(`Erro ao atualizar o CEP com ID ${id}: ${err.message}`);
    throw err;
  }
}

module.exports = { findCepById, updateCepData };
