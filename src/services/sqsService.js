
require('dotenv').config();


const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');


if (!process.env.AWS_REGION || !process.env.SQS_QUEUE_URL) {
  console.error('Erro: As variáveis de ambiente AWS_REGION ou SQS_QUEUE_URL não estão configuradas!');
  process.exit(1);  
}


const sqs = new SQSClient({ region: process.env.AWS_REGION });


const QueueUrl = process.env.SQS_QUEUE_URL;


console.log('AWS Region:', process.env.AWS_REGION);
console.log('SQS Queue URL:', process.env.SQS_QUEUE_URL);


async function sendToQueue(messageBody) {
  try {
    const command = new SendMessageCommand({ QueueUrl, MessageBody: messageBody });
    const data = await sqs.send(command);
    console.log('Mensagem enviada com sucesso:', data);
  } catch (error) {
    console.error('Erro ao enviar para a fila:', error);
  }
}


async function receiveFromQueue() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10 
    });
    const response = await sqs.send(command);

    if (response.Messages && response.Messages.length > 0) {
      console.log('Mensagem recebida com sucesso:', response.Messages[0].Body);
      return response.Messages[0]; 
    } else {
      console.log('Nenhuma mensagem na fila.');
      return null; 
    }
  } catch (error) {
    console.error('Erro ao receber mensagem da fila:', error);
    return null;
  }
}


async function deleteMessage(receiptHandle) {
  try {
    const command = new DeleteMessageCommand({ QueueUrl, ReceiptHandle: receiptHandle });
    await sqs.send(command);
    console.log('Mensagem deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
  }
}


module.exports = { sendToQueue, receiveFromQueue, deleteMessage };
