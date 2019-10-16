module.exports = {

  // consume response messages from RabbitMQ
  consumeResponse:
    (channel, correlationId, queueName) => new Promise((resolve, reject) => {
      channel.consume(queueName, (message) => {
        if (message && message.properties.correlationId === correlationId) {
          resolve(message);
        }
      }, {
        noAck: true,
      });
    }),


  // push request messages to RabbitMQ
  sendToQueue:
    async (channel, correlationId, requestQueueName, action, params = null) => {
      // build message
      const message = { id: correlationId, action, params };
      // Create response queue
      const { queue: responseQueueName } = await channel.assertQueue('', { exclusive: true });

      channel.sendToQueue(
        requestQueueName,
        Buffer.from(JSON.stringify(message), 'utf-8'), {
          correlationId,
          replyTo: responseQueueName,
        },
      );

      return responseQueueName;
    },

};
