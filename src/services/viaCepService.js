const axios = require('axios');

// Função para validar e formatar o CEP
function formatCep(cep) {
  // Remove qualquer caracter não numérico
  return cep.replace(/\D/g, '');  // Mantém apenas os números
}

// Função para buscar os dados do CEP
async function getCepData(cep) {
  // Formata o CEP para garantir que esteja no formato correto (apenas números)
  const formattedCep = formatCep(cep);

  // Verifica se o CEP tem o comprimento correto (8 dígitos)
  if (formattedCep.length !== 8) {
    throw new Error('CEP inválido. O CEP deve ter exatamente 8 números.');
  }

  // Faz a requisição para o ViaCEP
  const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);

  // Se o ViaCEP retornar erro (ex: CEP não encontrado)
  if (response.data.erro) {
    throw new Error('CEP inválido');
  }

  // Retorna os dados do endereço do CEP
  return response.data;
}

module.exports = { getCepData };
