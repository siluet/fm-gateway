require('make-promises-safe');
const app = require('fastify')({
  logger: process.env.NODE_ENV !== 'production',
  ignoreTrailingSlash: true,
});
const appEnv = require('fastify-env');
const appCors = require('fastify-cors');
const appHelmet = require('fastify-helmet');

const appErrorHandler = require('./plugins/error-handler');
const appAmqp = require('./plugins/amqp');
const appLog = require('./plugins/amqp-log');
const appTracing = require('./plugins/tracing');
const appRoutes = require('./plugins/routes');


const start = async (port, host) => {
  try {
    const address = await app.listen(port, host);
    app.log.info(`Gateway is listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

app
  .register(appErrorHandler)
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
      path: '.env',
      debug: false,
    },
  })

  .after((err) => {
    if (err) {
      // An error on config params.
      throw new Error(`Error occurred while parsing config params: ${err.message ? err.message : err}`);
    }

    app
      .register(appCors, { 
        origin: '*',
      })
      .register(appHelmet, {
        frameguard: false,
        permittedCrossDomainPolicies: false
      })
      .register(appAmqp, {
        url: app.config.RABBITMQ_URL,
      })
      .register(appLog)
      .register(appTracing)
      .register(appRoutes);
  })

  .ready((err) => {
    if (err) {
      throw new Error(`Error occurred while registering plugins: ${err.message ? err.message : err}`);
    }
    start(app.config.PORT, app.config.HOST);
  });
