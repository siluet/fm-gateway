const fastifyPlugin = require('fastify-plugin');

function fastifyAmqpLog(fastify, opts, next) {
  const levels = {
    fatal: 'fatal',
    error: 'error',
    warning: 'warning',
    info: 'info',
    debug: 'debug',
    trace: 'trace',
  };

  function publishMessage(appName, level, message) {
    const { channel } = fastify.amqp;
    const exchange = 'platform_logs';
    const key = `${appName}.${level}`;

    channel.assertExchange(exchange, 'topic', { durable: false });
    channel.publish(exchange, key, Buffer.from(JSON.stringify(message)));
  }

  function log(level, data) {
    const app = fastify.config.NAME;
    const message = {
      time: new Date().toISOString(),
      app,
      level,
      service: Array.isArray(data[0]) ? data[0].join('::') : data[0],
      id: fastify.reqid || '',
    };

    const [, logMsg = null] = data;

    // Add log message if exists
    if (logMsg) {
      message.log = logMsg;
    }

    publishMessage(app, level, message);
  }

  function trace(...data) {
    return log(levels.trace, data);
  }

  function debug(...data) {
    return log(levels.debug, data);
  }

  function info(...data) {
    return log(levels.info, data);
  }

  function warning(...data) {
    return log(levels.warning, data);
  }

  function error(...data) {
    return log(levels.error, data);
  }

  function fatal(...data) {
    return log(levels.fatal, data);
  }

  fastify.decorate('amqplog', {
    trace,
    debug,
    info,
    warning,
    error,
    fatal,
  });

  next();
}

module.exports = fastifyPlugin(fastifyAmqpLog, {
  fastify: '>=2.0.0',
  name: 'fastify-fm-amqp-log',
});
