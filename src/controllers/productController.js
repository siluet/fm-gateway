const boom = require('boom');
const uuidv4 = require('uuid/v4');
const utils = require('../utils');
const { queues, messages } = require('../messaging');

const controllerName = 'Product';


module.exports = {

  async getAll(req, reply) {
    this.amqplog.trace([controllerName, 'getAll'], 'start');

    const { channel } = this.amqp;
    const correlationId = this.reqid || uuidv4();
    // Set request params if exists
    const reqParams = {};
    if (req.params.uid) {
      /**  @TODO: validate user id before using */
      reqParams.uid = req.params.uid;
    }

    const promises = [
      utils.rpc(channel, correlationId, queues.product, messages.product.getAll, reqParams), // get products
    ];

    if (req.params.uid) {
      promises.push(
        utils.rpc(channel, correlationId, queues.basket, messages.basket.getByUserId, reqParams), // get user basket
      );
    }

    Promise.all(promises)
      .then((values) => {
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            products: JSON.parse(values[0]),
            basket: values[1] ? JSON.parse(values[1]) : [],
          });
      })
      .catch((err) => {
        // Unable to get a response in 6 seconds.
        this.amqplog.fatal(
          [controllerName, 'getAll'],
          `Unable to get response from product service: ${err.message ? err.message : err}`,
        );
        throw boom.boomify(err);
      });
  },

};
