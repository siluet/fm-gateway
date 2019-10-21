const boom = require('boom');
const requestPromise = require('request-promise-native');

const controllerName = 'Ping';

module.exports = class PingController {

  async pingAll(req, reply) {
    this.amqplog.trace([controllerName, 'pingAll'], 'start');

    this.amqplog.info([controllerName, 'pingAll'], 'requested ping');

    try {
      const uri = 'https://jsonplaceholder.typicode.com/users';
      const users = await requestPromise({
        uri,
        json: true,
      });

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(users);
    } catch (err) {
      throw boom.boomify(err);
    }

  }

};
