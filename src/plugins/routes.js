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
      schema: {
        description: 'Index page of gateway.',
        summary: 'Index page',
        response: {
          200: {
            description: 'Successful response.',
            type: 'string',
            example: 'Gateway up and running.',
          },
        },
      },
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
        description: 'Ping/Healthcheck point for gateway itself.',
        summary: 'Healthcheck of gateway',
        response: {
          200: {
            description: 'Successful response.',
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
      schema: {
        description: 'Ping/Healthcheck point for the services.',
        summary: 'Healthcheck of services',
        response: {
          200: {
            description: 'Responses from backend services.',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                service: { type: 'string' },
                response: {
                  type: 'object',
                  properties: {
                    ping: { type: 'string' },
                  },
                },
                responseTime: { type: 'string' },
              },
            },
          },
        },
      },
      handler: pingController.pingAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/products/:uid`,
      schema: {
        description: 'List of products & user basket.',
        summary: 'List of products & user basket',
        params: {
          uid: {
            description: 'User number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
        },
        response: {
          200: {
            description: 'List of products & user basket contents.',
            type: 'object',
            properties: {
              products: {
                description: 'List of products.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    desc: { type: 'string' },
                    price: { type: 'number' },
                    img: { type: 'string' },
                  },
                },
              },
              basket: {
                description: 'List of products in user basket.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    productid: { type: 'string' },
                    count: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
      handler: productController.getAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/products/`,
      schema: {
        description: 'List of products.',
        summary: 'List of products',
        response: {
          200: {
            description: 'List of products.',
            type: 'object',
            properties: {
              products: {
                description: 'List of products.',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    desc: { type: 'string' },
                    price: { type: 'number' },
                    img: { type: 'string' },
                  },
                },
              },
              basket: {
                description: 'Empty for guests',
                type: 'array',
                items: {},
              },
            },
          },
        },
      },
      handler: productController.getAll,
    },

    {
      method: 'GET',
      url: `/${currentVersion}/basket/:uid`,
      schema: {
        description: 'List of products in user basket.',
        summary: 'List of products in basket',
        params: {
          uid: {
            description: 'User number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
        },
        response: {
          200: {
            description: 'List of basket contents.',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                productid: { type: 'string' },
                count: { type: 'number' },
              },
            },
          },
        },
      },
      handler: basketController.getByUserId,
    },

    {
      method: ['POST', 'PUT'],
      url: `/${currentVersion}/basket/:uid/:pid`,
      schema: {
        description: 'Adds given product to given user basket.',
        summary: 'Add to basket',
        params: {
          uid: {
            description: 'User number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
          pid: {
            description: 'Product number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
        },
        response: {
          201: {
            description: 'Given product id, successfully added to given user basket.',
            type: 'object',
          },
        },
      },
      handler: basketController.add,
    },
    {
      method: 'DELETE',
      url: `/${currentVersion}/basket/:uid/:pid`,
      schema: {
        description: 'Deletes given product from given user basket.',
        summary: 'Delete from basket',
        params: {
          uid: {
            description: 'User number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
          pid: {
            description: 'Product number',
            type: 'string',
            pattern: '^[0-9]+$',
          },
        },
        response: {
          204: {
            description: 'Given product id, successfully deleted from given user basket.',
            type: 'object',
          },
        },
      },
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
