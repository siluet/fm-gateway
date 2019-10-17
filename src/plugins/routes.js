const fastifyPlugin = require('fastify-plugin');

const UserController = require('../controllers/UserController');
const PingController = require('../controllers/Ping');


async function fastifyRoutes(fastify, opts, next) {

  const currentVersion = 'v1';

  const userController = new UserController();
  const pingController = new PingController();
  
  const routes = [
    {
      method: 'GET',
      url: '/',
      handler: (request, reply) => {
        reply
          .code(200)
          .header('Content-Type', 'text/plain; charset=utf-8')
          .send('Hello');
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
              ping: { type: 'string' }
            }
          }
        }
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
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              ping: { type: 'string' }
            }
          }
        }
      },
      handler: pingController.pingAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/users`,
      handler: userController.getAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/users/:id`,
      handler: userController.getById,
    },

    {
      method: 'POST',
      url: `/${currentVersion}/users`,
      schema: {
        body: {
          type: 'object',
        },
      },
      handler: userController.insert,
    },

    {
      method: 'PUT',
      url: `/${currentVersion}/users/:id`,
      handler: userController.updateById,
    },

    {
      method: 'DELETE',
      url: `/${currentVersion}/users/:id`,
      handler: userController.deleteById,
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
