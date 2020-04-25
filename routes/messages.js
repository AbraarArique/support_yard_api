const express = require('express');
const router = express.Router({ mergeParams: true });

const Ticket = require('../models/ticket');
const { err, secureParams, updateDoc } = require('./helpers');

const create = async (req, res) => {
  try {
    const ticket = await getTicket(req.params.ticketId);
    const message = new Message(messageParams(req.body));
    message.ticketId = ticket._id;
    message.userId = req.user._id;
    await message.save();
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const update = async (req, res) => {
  try {
    const ticket = await getTicket(req.params.ticketId);
    const message = await getMessage(req.params.messageId);
    updateDoc(message, messageParams(req.body));
    await message.save();
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const destroy = async (req, res) => {
  try {
    const ticket = await getTicket(req.params.ticketId);
    const message = await getMessage(req.params.messageId);
    await Message.deleteOne(message);
    res.status(200).json(message);
  } catch (e) {
    res.status(422).json(err(e));
  }
}

const getTicket = async (id) => {
  if (req.user.isCustomer) {
    const [ticket] = await req.user.tickets({ id });
    return ticket;
  } else if (req.user.isAgent) {
    return await Ticket.findOne({ id });
  }
}

const getMessage = async (d) => {
  const [message] = req.user.messages({ id });
  return message;
}

const messageParams = params => {
  return secureParams(params, [
    'message'
  ]);
}

router.post('/', create);
router.patch('/:messageId', update);
router.delete('/:messageId', destroy);

module.exports = router;
