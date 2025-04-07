const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const QueueUrl = process.env.SQS_QUEUE_URL;

async function sendToQueue(messageBody) {
  const command = new SendMessageCommand({ QueueUrl, MessageBody: messageBody });
  await sqs.send(command);
}

async function receiveFromQueue() {
  const command = new ReceiveMessageCommand({
    QueueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10
  });
  const response = await sqs.send(command);
  return response.Messages?.[0];
}

async function deleteMessage(receiptHandle) {
  const command = new DeleteMessageCommand({ QueueUrl, ReceiptHandle: receiptHandle });
  await sqs.send(command);
}

module.exports = { sendToQueue, receiveFromQueue, deleteMessage };
