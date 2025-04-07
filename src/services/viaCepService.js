const axios = require('axios');

async function getCepData(cep) {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.data.erro) throw new Error('CEP inválido');
  return response.data;
}

module.exports = { getCepData };
