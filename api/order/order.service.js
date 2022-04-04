const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
  query,
  add,
  update
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

async function add(order) {
  try {
    const collection = await dbService.getCollection('order')
    const addedOrder = await collection.insertOne(order)
    return addedOrder
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

async function update(order) {
  try {
    var id = ObjectId(order._id)
    delete order._id
    const collection = await dbService.getCollection('order')
    await collection.updateOne({ _id: id }, { $set: { ...order } })
    return order
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}


function _buildCriteria(filterBy) {
  if (filterBy.userId) {
    return { userId: ObjectId(filterBy.userId) }
  } else if (filterBy.stayId) {
    return { stayId: ObjectId(filterBy.stayId) }
  }
  return {}
}
