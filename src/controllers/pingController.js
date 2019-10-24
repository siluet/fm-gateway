const uuidv4 = require('uuid/v4');
const { sendToQueue, consumeResponse } = require('../utils');


const {
  queues,
  messages: { ping: pingMessage },
} = require('../messaging');

const controllerName = 'Ping';


module.exports = {

  async pingAll(req, reply) {
    this.amqplog.trace([controllerName, 'pingAll'], 'start');

    const correlationId = this.reqid || uuidv4();
    const { channel } = this.amqp;

    const pingService = async (serviceName, queueName) => {
      // Keeping time to calculate response time
      const start = new Date();
      const responseQueueName = await sendToQueue(channel, correlationId, queueName, pingMessage);

      let strResp = null;
      try {
        const resp = await consumeResponse(channel, correlationId, responseQueueName, 6000);
        strResp = JSON.parse(resp.content.toString());
      } catch (err) {
        // Unable to get a response in 6 seconds.
        this.amqplog.fatal(
          [controllerName, 'pingAll'],
          `Unable to ping ${serviceName}: ${err.message ? err.message : err}`,
        );
      }

      return {
        service: serviceName,
        response: strResp,
        responseTime: `${new Date() - start} ms`,
      };
    };

    // List the service names to ping
    const serviceNames = ['product', 'basket'];

    Promise.all(serviceNames.map((serviceName) => pingService(serviceName, queues[serviceName])))
      .then((pongs) => {
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(pongs);
      });
  },

};
