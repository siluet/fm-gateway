module.exports = {
  messages: {
    user: {
      getAll: 'ALL_REQUESTED',
      getById: 'GET_BY_ID_REQUESTED',
      insert: 'INSERT_REQUESTED',
      updateById: 'UPDATE_BY_ID_REQUESTED',
      deleteById: 'DELETE_BY_ID_REQUESTED',
    },
  },
  
  queues: {
    user: 'request-user',
  },

};
