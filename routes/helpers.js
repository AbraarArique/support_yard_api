const secureParams = (params, list) => {
  const safe = {};
  for (p in params) {
    if (list.includes(p)) {
      safe[p] = params[p];
    }
  }
  return safe;
}

const updateDoc = (doc, params) => {
  for (p in params) {
    doc[p] = params[p];
  }
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

module.exports = {
  secureParams,
  updateDoc,
  err
};
