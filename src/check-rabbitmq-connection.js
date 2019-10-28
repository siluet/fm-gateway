require('dotenv').config();
const amqp = require('amqplib');

// This file for checking rabbitmq connection during setup phase
(async () => {
  // try connectting to RabbitMQ Instance
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  console.log(`${process.env.NAME || 'App'} connected to rabbitmq.`);
  connection.close();
})().catch(err => {
  console.log(`${process.env.NAME || 'App'} got error while connecting to rabbitmq: ${err.message ? err.message : err}`);
  // throw error;
  process.exit(1);
});
