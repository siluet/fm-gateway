const fastifyPlugin = require('fastify-plugin');

const ProductController = require('../controllers/ProductController');
const BasketController = require('../controllers/BasketController');
const PingController = require('../controllers/PingController');


async function fastifyRoutes(fastify, opts, next) {

  const currentVersion = 'v1';

  const productController = new ProductController();
  const basketController = new BasketController();
  const pingController = new PingController();

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
      url: `/${currentVersion}/basket/:uid`,
      handler: basketController.getById,
    },

    // {
    //   method: 'POST',
    //   url: `/${currentVersion}/users`,
    //   schema: {
    //     body: {
    //       type: 'object',
    //     },
    //   },
    //   handler: basketController.insert,
    // },

    // {
    //   method: 'PUT',
    //   url: `/${currentVersion}/users/:id`,
    //   handler: Controller.updateById,
    // },

    // {
    //   method: 'DELETE',
    //   url: `/${currentVersion}/users/:id`,
    //   handler: userController.deleteById,
    // },
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
