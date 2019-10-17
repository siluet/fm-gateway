const fastifyPlugin = require('fastify-plugin');

function fastifyAmqpLog(fastify, opts, next) {
  const levels = {
    fatal: 'fatal',
    error: 'error',
    warning: 'warning',
    info: 'info',
    debug: 'debug',
    trace: 'trace'
  };

  const levelsNumbers = {
    [levels.fatal]: 0,
    [levels.error]: 2,
    [levels.warning]: 4,
    [levels.info]: 6,
    [levels.debug]: 8,
    [levels.trace]: 10,
  };

  function _publishMessage(appName, level, message) {
    const { channel } = fastify.amqp;
    const exchange = 'platform_logs';
    const key = `${appName}.${level}`;

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, Buffer.from(JSON.stringify(message)));

    console.log(message);
  }

  function _log(level, data) {
    const app = fastify.config.NAME;
    const message = {
      time: new Date().toISOString(),
      app,
      nlevel: levelsNumbers[level],
      level,
      source: Array.isArray(data[0]) ? data[0].join('::') : data[0],
      log: data[1],
    };

    _publishMessage(app, level, message);
  }

  function trace(...data) {
    return _log(levels.trace, data);
  }

  function debug(...data) {
    return _log(levels.debug, data);
  }

  function info(...data) {
    return _log(levels.info, data);
  }

  function warning(...data) {
    return _log(levels.warning, data);
  }

  function error(...data) {
    return _log(levels.error, data);
  }

  function fatal(...data) {
    return _log(levels.fatal, data);
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
