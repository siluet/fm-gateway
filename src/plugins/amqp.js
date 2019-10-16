const fastifyPlugin = require('fastify-plugin');
const amqp = require('amqplib');

async function fastifyAmqp(fastify, opts, next) {
  const connUrl = opts.url ? opts.url : `amqp://${opts.user}:${opts.pass}@${opts.host}:${opts.port}/`;
  let conn,
    channel;
  try {
    // connect to RabbitMQ
    conn = await amqp.connect(connUrl);
    // create a channel
    channel = await conn.createChannel();
  } catch (err) {
    console.log('Error occurred while initializing RabbitMQ!');
    next(err);
    return;
  }

  fastify.addHook('onClose', () => conn.close());
  fastify.decorate('amqp', {
    conn,
    channel,
  });


  // // handle connection closed
  // connection.on('close', (err) => {
  // });

  // // handle errors
  // connection.on('error', (err) => {
  // });

  next();
}

module.exports = fastifyPlugin(fastifyAmqp, {
  fastify: '>=2.0.0',
  name: 'fastify-fm-amqp',
});
