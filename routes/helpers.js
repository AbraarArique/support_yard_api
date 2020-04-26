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
  const query = user.isCustomer ? { userId: user._id, _id: id } : { _id: id };
  return await Ticket.findOne(query).populate('userId', 'email');
}

module.exports = {
  secureParams,
  updateDoc,
  err,
  getTicket
};
