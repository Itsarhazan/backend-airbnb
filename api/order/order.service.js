const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
  query,
  addOrder,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    var orders = await collection.find(criteria).toArray()
    // _sort(orders, filterBy.sortBy)
    return orders
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

async function addOrder(order) {
  const orderToAdd = {
    hostId: ObjectId(order.hostId),
    date: order.date,
    booker: order.booker,
    imgUrl: order.imgUrl,
    stay: order.stay,
    tripDates: order.tripDates,
    nights: order.nights,
    guests: order.guests,
    amount: order.amount,
    status: 'pending'
  }

  const collection = await dbService.getCollection('order')
  const addedOrder = await collection.insertOne(orderToAdd)

  orderToAdd._id = addedOrder.insertedId
  return orderToAdd
}

function _buildCriteria(filterBy) {
  if (filterBy.userId) {
    return { userId: ObjectId(filterBy.userId) }
  } else if (filterBy.stayId) {
    return { stayId: ObjectId(filterBy.stayId) }
  }
  return {}
}
