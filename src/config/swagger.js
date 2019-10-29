exports.options = (config) => ({
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'API Gateway',
      description: 'Gateway of the api platform',
      version: config.VER,
    },
    host: `${config.HOST}:${config.PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});
