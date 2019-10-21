module.exports = {
  messages: {
    product: {
      getAll: 'GET_ALL',
      getById: 'GET_BY_ID_REQUESTED',
      insert: 'INSERT_REQUESTED',
      updateById: 'UPDATE_BY_ID_REQUESTED',
      deleteById: 'DELETE_BY_ID_REQUESTED',
    },
    basket: {
    },
  },

  queues: {
    product: 'request-product',
    basket: 'request-basket',
  },

};
