const boom = require('boom');
const uuidv4 = require('uuid/v4');
const { sendToQueue, consumeResponse } = require('../utils');


const {
  queues: { user: requestQueueName },
  messages: { user: messages },
} = require('../messaging');


module.exports = class UserController {

  async getAll(req, reply) {
    const { channel } = this.amqp;
    const correlationId = uuidv4();
    const responseQueueName = await sendToQueue(channel, correlationId, requestQueueName, messages.getAll);
    const resp = await consumeResponse(channel, correlationId, responseQueueName);
    
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ msg: JSON.parse(resp.content) });
  }

  async getById({ params }, reply) {
    try {
      const uri = `https://jsonplaceholder.typicode.com/users/${params.id}`;
      const user = await requestPromise({
        uri,
        json: true,
      });

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(user);
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async insert({
    params,
  }, reply) {
    try {
      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(params.id);
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async updateById({
    params,
  }, reply) {
    try {
      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(params.id);
    } catch (err) {
      throw boom.boomify(err);
    }
  }

  async deleteById({
    params,
  }, reply) {
    try {
      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(params.id);
    } catch (err) {
      throw boom.boomify(err);
    }
  }
};
