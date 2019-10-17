require('make-promises-safe');
const app = require('fastify')({
  logger: process.env.NODE_ENV !== 'production', // { level: 'trace' },
  ignoreTrailingSlash: true,
});
const appEnv = require('fastify-env');
const appHelmet = require('fastify-helmet');

const appAmqp = require('./plugins/amqp');
const appLog = require('./plugins/amqp-log');
const appTracing = require('./plugins/tracing');
const appRoutes = require('./plugins/routes');


const start = async (port, host) => {
  try {
    const address = await app.listen(port, host);
    app.log.info(`Gateway is listening on ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

app
  .register(appEnv, {
    confKey: 'config',
    schema: {
      type: 'object',
      required: ['NAME', 'PORT', 'HOST', 'RABBITMQ_URL'],
      properties: {
        NAME: {
          type: 'string',
        },
        PORT: {
          type: 'string',
        },
        HOST: {
          type: 'string',
        },
        NODE_ENV: {
          type: 'string',
          default: 'production',
        },
        VER: {
          type: 'string',
        },
        RABBITMQ_URL: {
          type: 'string',
        },
      },
    },
    data: process.env,
    dotenv: {
      path: `${__dirname}/.env`,
      debug: false,
    },
  })

  .after((err) => {
    if (err) {
      console.error(err);
    }

    app
      .register(appHelmet)
      .register(appAmqp, {
        url: app.config.RABBITMQ_URL,
      })
      .register(appLog, {
        level: 'info'
      })
      .register(appTracing)
      .register(appRoutes);
  })

  .ready((err) => {
    if (err) {
      console.error(err);
    }
    start(app.config.PORT, app.config.HOST);
  });
