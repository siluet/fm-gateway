// It would be better to share this constants across services to keep integrity of system.

module.exports = {
  messages: {
    ping: 'PING',
    product: {
      getAll: 'GET_ALL',
    },
    basket: {
      getByUserId: 'GET_BY_USERID',
      add: 'ADD',
      delete: 'DELETE',
    },
  },

  queues: {
    product: 'request-product',
    basket: 'request-basket',
  },

};
