const orderService = require('./order.service.js')
const logger = require('../../services/logger.service')

module.exports = {
  getOrders,
  addOrder,
  updateOrder
}

async function getOrders(req, res) {
  try {
    const filterBy = req.query
    const orders = await orderService.query(filterBy)
    res.send(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

async function addOrder(req, res) {
  try {
    const order = req.body
    const addedOrder = await orderService.add(order)
    res.send(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}


async function updateOrder(req, res) {
  try {
    const order = req.body
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

