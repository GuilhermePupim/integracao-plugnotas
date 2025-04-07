const CepEntry = require('../models/CepEntry');

async function findCepById(id) {
  return await CepEntry.findById(id);
}

async function updateCepData(id, status, data = null) {
  return await CepEntry.findByIdAndUpdate(id, { status, ...(data && { data }) }, { new: true });
}

module.exports = { findCepById, updateCepData };
