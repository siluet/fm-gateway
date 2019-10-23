const fastifyPlugin = require('fastify-plugin');
const uuidv4 = require('uuid/v4');


function fastifyTracing(fastify, options, next) {

  fastify.addHook('onRequest', (request, reply, done) => {
    const requestId = uuidv4();
    if (fastify.hasDecorator('reqid')) {
      fastify.reqid = requestId;
    } else {
      fastify.decorate('reqid', requestId);
    }

    fastify.amqplog.trace(['tracing', 'onRequest'], {
      method: request.raw.method || '',
      url: `${request.raw.hostname}${request.raw.url}`,
      ip: request.req.ip,
    });

    done();
  });

  fastify.addHook('onResponse', (request, reply, done) => {
    fastify.amqplog.trace(['tracing', 'onResponse']);
    done();
  });

  fastify.addHook('onError', (request, reply, error, done) => {
    fastify.amqplog.trace(['tracing', 'onError']);
    done();
  });

  fastify.addHook('onClose', (instance, done) => {
    fastify.amqplog.trace(['tracing', 'onClose']);
    done();
  });

  next();
}

module.exports = fastifyPlugin(fastifyTracing, {
  fastify: '>=2.0.0',
  name: 'fastify-fm-tracing',
});
