const fastifyPlugin = require('fastify-plugin');

const productController = require('../controllers/productController');
const basketController = require('../controllers/basketController');
const pingController = require('../controllers/pingController');


async function fastifyRoutes(fastify, opts, next) {

  const currentVersion = 'v1';

  const routes = [
    {
      method: 'GET',
      url: '/',
      handler: (request, reply) => {
        reply
          .code(200)
          .header('Content-Type', 'text/plain; charset=utf-8')
          .send('Gateway up and running.');
      },
    },

    {
      method: 'GET',
      url: '/pingself',
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              ping: { type: 'string' },
            },
          },
        },
      },
      handler: (request, reply) => {
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            ping: 'pong',
          });
      },
    },

    {
      method: 'GET',
      url: '/ping',
      handler: pingController.pingAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/products/:uid`,
      handler: productController.getAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/products/`,
      handler: productController.getAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/basket/:uid`,
      handler: basketController.getByUserId,
    },

    {
      method: ['POST', 'GET'],
      url: `/${currentVersion}/basket/:uid/:pid`,
      handler: basketController.add,
    },
    {
      method: 'DELETE',
      url: `/${currentVersion}/basket/:uid/:pid`,
      handler: basketController.delete,
    },

  ];


  routes.forEach((route) => {
    fastify.route(route);
  });

  next();
}

module.exports = fastifyPlugin(fastifyRoutes, {
  fastify: '>=2.0.0',
  name: 'fastify-fm-routes',
});
