const mongoose = require('mongoose');

const hasMany = (schema, model, name, field) => {
  schema.methods[name] = async function(query) {
    const data = await mongoose.model(model).find(Object.assign({ [field]: this.id }, query));
    return data;
  }
}

const belongsTo = (schema, model, name, field) => {
  schema.methods[name] = async function() {
    const data = await mongoose.model(model).findById(this[field]);
    return data;
  }
}

module.exports = {
  hasMany,
  belongsTo
};
