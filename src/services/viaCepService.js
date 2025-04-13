const axios = require('axios');


function formatCep(cep) {
  
  return cep.replace(/\D/g, '');  
}


async function getCepData(cep) {
  
  const formattedCep = formatCep(cep);

  
  if (formattedCep.length !== 8) {
    throw new Error('CEP inválido. O CEP deve ter exatamente 8 números.');
  }

  
  const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);

  
  if (response.data.erro) {
    throw new Error('CEP inválido');
  }

  
  return response.data;
}

module.exports = { getCepData };
