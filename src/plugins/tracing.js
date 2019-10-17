const fastifyPlugin = require('fastify-plugin');
const uuidv4 = require('uuid/v4');


function tracing(fastify, options, next) {

  fastify.addHook('onRequest', (request, reply, done) => {
    const requestId = uuidv4();
    if (fastify.hasDecorator('reqid')) {
      fastify.reqid = requestId;
    } else {
      fastify.decorate('reqid', requestId);
    }

    console.log("*** onRequest " + requestId);
    // console.log('body')
    // console.log(request.body)
    // console.log('query')
    // console.log(request.query)
    // console.log('params')
    // console.log(request.params)
    // console.log('headers')
    // console.log(request.headers)
    const requestData = `${request.raw.method} ${request.raw.hostname}${request.raw.url}`;
    console.log(requestData);
    console.log(request.req.ip);
    done();
  });

  fastify.addHook('onResponse', (request, reply, done) => {
    console.log('*** onResponse ' + fastify.reqid || '');
    done();
  });

  fastify.addHook('onError', (request, reply, error, done) => {
    console.log('*** onError ' + fastify.reqid || '');
    done();
  });

  fastify.addHook('onClose', (instance, done) => {
    console.log('*** onClose');
    done();
  });

  next();
}

module.exports = fastifyPlugin(tracing);
