const path = require('path');
const fastifyPlugin = require('fastify-plugin');

function fastifyErrorHandler(fastify, opts, next) {

  function fatal(err) {
    let errorStack = '';
    const basePath = path.resolve(__dirname, '../');
    if (err.stack && err.stack !== '') {
      err.stack.split('\n').forEach((log) => {
        if (!log.includes('node_modules')) {
          errorStack += ` ${log.replace(basePath, '').trim()}`;
        }
      });
    }

    console.log(errorStack);

    // If Amqp is defined, publish error
    if (fastify.amqplog) {
      fastify.amqplog.fatal(['ErrorHandler', 'fatal'], errorStack);
    } else {
      /** @TODO: Error occurred before rabbitmq connection, define some fallback path for keeping log */
    }

    // setTimeout is needed to finish publishing error
    setTimeout(() => {
      process.exit(1);
    }, 100);

  }

  process.on('unhandledRejection', fatal);
  process.on('uncaughtException', fatal);

  next();
}


module.exports = fastifyPlugin(fastifyErrorHandler, {
  fastify: '>=2.0.0',
  name: 'fastify-fm-error-handler',
});
