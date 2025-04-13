const CepEntry = require('../models/CepEntry');


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


async function updateCepData(id, status, data = null) {
  const updateData = { status };

  
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
