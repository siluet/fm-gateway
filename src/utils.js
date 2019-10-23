const pTimeout = require('p-timeout');

module.exports = {

  /**
   * Consume response messages from RabbitMQ.
   * If timeout(ms) is provided, throws TimeoutError after specified amount of time.
  */
  consumeResponse:
    (channel, correlationId, queueName, timeout = null) => {
      const consume = () => new Promise((resolve) => {
        channel.consume(queueName, (message) => {
          if (message && message.properties.correlationId === correlationId) {
            resolve(message);
          }
        }, {
          noAck: true,
        });
      });

      if (timeout) {
        return pTimeout(consume(), timeout).then((resp) => resp);
      }
      return consume();
    },

  /**
   * Push request messages to RabbitMQ.
  */
  sendToQueue:
    async (channel, correlationId, requestQueueName, action, params = null) => {
      // build message
      const message = { id: correlationId, action };
      if (params !== null) {
        message.params = params;
      }
      // Create response queue
      const { queue: responseQueueName } = await channel.assertQueue('', { exclusive: true, messageTtl: 30000 });

      channel.sendToQueue(
        requestQueueName,
        Buffer.from(JSON.stringify(message), 'utf-8'),
        {
          correlationId,
          replyTo: responseQueueName,
        },
      );

      return responseQueueName;
    },

};
