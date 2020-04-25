const express = require('express');
const router = express.Router();

const Ticket = require('../models/ticket');
const messages = require('./messages');
const { err, secureParams, updateDoc } = require('./helpers');

const index = async (req, res) => {
  try {
    const user = req.user;
    const tickets = await user.tickets();
    res.status(200).json(tickets);
  } catch (e) {
    res.status(400).json(err(e));
  }
}

const show = async (req, res) => {
  try {
    const user = req.user;
    const [ticket] = await user.tickets({ id: req.params.ticketId });
    const messages = await ticket.messages();
    const data = { ticket, messages };
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(err(e));
  }
}

const create = async (req, res) => {
  try {
    const user = req.user;
    const ticket = new Ticket(ticketParams(req.body));
    ticket.userId = req.user._id;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (e) {
    res.status(400).json(err(e));
  }
}

const all = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (e) {
    res.status(400).json(err(e));
  }
}

const ticketParams = params => {
  return secureParams(params, [
    'subject',
    'details'
  ]);
}

const verifyUser = (type) => {
  const handler = (req, res, next) => {
    if (req.user[type]) {
      next();
    } else {
      res.status(401).json(err(null, 'You are not authorized to do this'));
    }
  }
  return handler;
}

router.get('/', verifyUser('isCustomer'), index);
router.post('/', verifyUser('isCustomer'), create);
router.get('/all', verifyUser('isAgent'), all);
router.get('/:ticketId', verifyUser('isCustomer'), show);
router.use('/:ticketId/messages', messages);

module.exports = router;
