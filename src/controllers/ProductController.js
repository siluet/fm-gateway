const boom = require('boom');
const uuidv4 = require('uuid/v4');
const { sendToQueue, consumeResponse } = require('../utils');


const {
  queues: { product: requestQueueName },
  messages: { product: messages },
} = require('../messaging');

const controllerName = 'Product';

module.exports = class ProductController {

  async getAll(req, reply) {
    this.amqplog.trace([controllerName, 'getAll'], 'start');

    const { channel } = this.amqp;
    const correlationId = uuidv4();
    const responseQueueName = await sendToQueue(channel, correlationId, requestQueueName, messages.getAll);
    const resp = await consumeResponse(channel, correlationId, responseQueueName);

    console.log( JSON.parse(resp.content.toString()) );

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ msg: JSON.parse(resp.content.toString()) });
  }

};
