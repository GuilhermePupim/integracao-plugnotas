const mongoose = require('mongoose');

const cepSchema = new mongoose.Schema({
  cep: String,
  status: { type: String, enum: ['PENDENTE', 'CONCLUIDO', 'REJEITADO'], default: 'PENDENTE' },
  data: Object,
}, { timestamps: true });

module.exports = mongoose.model('CepEntry', cepSchema);
