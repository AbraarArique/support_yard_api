const mongoose = require('mongoose');

const { hasMany, belongsTo } = require('./helpers');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message can\'t be blank']
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

belongsTo(messageSchema, 'Ticket', 'ticket', 'ticketId');
belongsTo(messageSchema, 'User', 'user', 'userId');

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
