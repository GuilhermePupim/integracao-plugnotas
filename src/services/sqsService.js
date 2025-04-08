// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa os módulos necessários da AWS SDK
const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

// Verifica se as variáveis de ambiente estão carregadas corretamente
if (!process.env.AWS_REGION || !process.env.SQS_QUEUE_URL) {
  console.error('Erro: As variáveis de ambiente AWS_REGION ou SQS_QUEUE_URL não estão configuradas!');
  process.exit(1);  // Encerra o processo se as variáveis não estiverem definidas
}

// Cria um cliente SQS com a região configurada nas variáveis de ambiente
const sqs = new SQSClient({ region: process.env.AWS_REGION });

// Pega a URL da fila a partir da variável de ambiente
const QueueUrl = process.env.SQS_QUEUE_URL;

// Verifica se as variáveis estão corretas
console.log('AWS Region:', process.env.AWS_REGION);
console.log('SQS Queue URL:', process.env.SQS_QUEUE_URL);

// Função para enviar uma mensagem para a fila SQS
async function sendToQueue(messageBody) {
  try {
    const command = new SendMessageCommand({ QueueUrl, MessageBody: messageBody });
    const data = await sqs.send(command);
    console.log('Mensagem enviada com sucesso:', data);
  } catch (error) {
    console.error('Erro ao enviar para a fila:', error);
  }
}

// Função para receber uma mensagem da fila SQS
async function receiveFromQueue() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10 // Long polling de 10 segundos
    });
    const response = await sqs.send(command);

    if (response.Messages && response.Messages.length > 0) {
      console.log('Mensagem recebida com sucesso:', response.Messages[0].Body);
      return response.Messages[0]; // Retorna a primeira mensagem recebida
    } else {
      console.log('Nenhuma mensagem na fila.');
      return null; // Retorna null se não houver mensagens
    }
  } catch (error) {
    console.error('Erro ao receber mensagem da fila:', error);
    return null; // Retorna null em caso de erro
  }
}

// Função para deletar uma mensagem da fila após o processamento
async function deleteMessage(receiptHandle) {
  try {
    const command = new DeleteMessageCommand({ QueueUrl, ReceiptHandle: receiptHandle });
    await sqs.send(command);
    console.log('Mensagem deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
  }
}

// Exporta as funções para uso em outros módulos
module.exports = { sendToQueue, receiveFromQueue, deleteMessage };
