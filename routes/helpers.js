const Ticket = require('../models/ticket');

const secureParams = (params, list) => {
  const safe = {};
  for (p in params) {
    if (list.includes(p)) {
      safe[p] = params[p];
    }
  }
  return safe;
}

const updateDoc = (doc, params, list) => {
  list.forEach(i => {
    doc[i] = params[i];
  });
}

const err = (err, msg = 'Something went wrong.') => {
  if (err && err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(k => {
      return err.errors[k].message
    });
    return {
      errors: errors
    };
  } else {
    return {
      errors: [msg]
    };
  }
}

const getTicket = async (user, id) => {
  if (user.isCustomer) {
    const [ticket] = await user.tickets({ _id: id });
    return ticket;
  } else if (user.isAgent) {
    return await Ticket.findOne({ _id: id });
  }
  return null;
}

module.exports = {
  secureParams,
  updateDoc,
  err,
  getTicket
};
