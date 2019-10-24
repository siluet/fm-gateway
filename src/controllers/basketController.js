const boom = require('boom');
const uuidv4 = require('uuid/v4');
const utils = require('../utils');


const {
  queues: { basket: requestQueueName },
  messages: { basket: messages },
} = require('../messaging');

const controllerName = 'Basket';


module.exports = {

  async getByUserId(req, reply) {
    this.amqplog.trace([controllerName, 'getByUserId'], 'start');

    const { channel } = this.amqp;
    const correlationId = this.reqid || uuidv4();
    const params = { uid: req.params.uid };

    let resp = null;
    try {
      resp = await utils.rpc(channel, correlationId, requestQueueName, messages.getByUserId, params);
    } catch (err) {
      // Unable to get a response in given time.
      this.amqplog.fatal(
        [controllerName, 'getByUserId'],
        `Unable to get response from basket service: ${err.message ? err.message : err}`,
      );
      throw boom.boomify(err);
    }

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(JSON.parse(resp));
  },


  async add({ params: { uid, pid } }, reply) {
    this.amqplog.trace([controllerName, 'add'], 'start');
    const { channel } = this.amqp;
    const correlationId = this.reqid || uuidv4();

    let resp = null;
    try {
      resp = await utils.rpc(channel, correlationId, requestQueueName, messages.add, { uid, pid });
    } catch (err) {
      // Unable to get a response in 6 seconds.
      this.amqplog.fatal(
        [controllerName, 'add'],
        `Unable to get response from basket service: ${err.message ? err.message : err}`,
      );
      throw boom.boomify(err);
    }

    // check returned result
    if (!JSON.parse(resp)) {
      // failed for some reason. log & inform user.
      this.amqplog.warning(
        [controllerName, 'add'],
        `Unable to add product #${pid} to user #${uid} basket`,
      );
      throw boom.boomify(new Error('An error occurred. Please try again later.'));
    }

    // success. send 201 (Created) or 204 (No Content) header without content.
    reply
      .code(201)
      .send();
  },


  async delete({ params: { uid, pid } }, reply) {
    this.amqplog.trace([controllerName, 'delete'], 'start');
    const { channel } = this.amqp;
    const correlationId = this.reqid || uuidv4();

    let resp = null;
    try {
      resp = await utils.rpc(channel, correlationId, requestQueueName, messages.delete, { uid, pid });
    } catch (err) {
      // Unable to get a response in 6 seconds.
      this.amqplog.fatal(
        [controllerName, 'delete'],
        `Unable to get response from basket service: ${err.message ? err.message : err}`,
      );
      throw boom.boomify(err);
    }

    if (!JSON.parse(resp)) {
      // failed for some reason. log & inform user.
      this.amqplog.warning(
        [controllerName, 'delete'],
        `Unable to delete product #${pid} from user #${uid} basket`,

      );
      throw boom.boomify(new Error('An error occurred. Please try again later.'));
    }

    // success. 204 (No Content) header without content.
    reply
      .code(204)
      .send();
  },

};
