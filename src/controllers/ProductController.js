const boom = require('boom');
const uuidv4 = require('uuid/v4');
const { sendToQueue, consumeResponse } = require('../utils');

const {
  queues: { product: requestQueueName },
  messages: { product: messages },
} = require('../messaging');

const controllerName = 'Product';

module.exports = {

  async getAll(req, reply) {
    this.amqplog.trace([controllerName, 'getAll'], 'start');

    const { channel } = this.amqp;
    const correlationId = this.reqid || uuidv4();
    // Set request params if exists
    const reqParams = {};
    if (req.params.uid) {
      reqParams.userid = req.params.uid;
    }
    const responseQueueName = await sendToQueue(channel, correlationId, requestQueueName, messages.getAll, reqParams);

    let resp = null;
    try {
      resp = await consumeResponse(channel, correlationId, responseQueueName, 6000);
    } catch (err) {
      // Unable to get a response in 6 seconds.
      this.amqplog.fatal(
        [controllerName, 'getAll'],
        `Unable to get response from product service: ${err.message ? err.message : err}`,
      );
      throw boom.boomify(err);
    }

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ data: JSON.parse(resp.content.toString()) });
  },

};
