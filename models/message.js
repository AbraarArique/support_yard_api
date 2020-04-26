const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message can\'t be blank']
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Ticket'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
