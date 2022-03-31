const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
  query,
  addOrder,
  remove,
}

async function query(filterBy = {}) {
  const collection = await dbService.getCollection('order')

  const orders = await collection
    .aggregate([
      { $match: _buildCriteria(filterBy) },
      {
        $lookup: {
          from: 'user',
          foreignField: '_id',
          localField: 'userId',
          as: 'user',
        },
      },
      { $unwind: '$user' }, // [{.....}] ==> {.....}
      {
        $lookup: {
          from: 'toy',
          foreignField: '_id',
          localField: 'toyId',
          as: 'toy',
        },
      },
      { $unwind: '$toy' }, // [{.....}] ==> {.....}
      {
        $project: {
          _id: 1,
          content: 1,
          rate: 1,
          user: { _id: 1, username: 1 },
          toy: { _id: 1, name: 1, price: 1 },
        },
      },
    ])
    .toArray()

  return orders
}

async function addOrder(order) {
  const orderToAdd = {
    userId: ObjectId(order.userId),
    toyId: ObjectId(order.toyId),
    content: order.content,
    rate: order.rate,
  }

  const collection = await dbService.getCollection('order')
  const addedOrder = await collection.insertOne(orderToAdd)

  orderToAdd._id = addedOrder.insertedId
  return orderToAdd
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('order')
    const criteria = { _id: ObjectId(orderId) }
    await collection.deleteOne(criteria)
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

// function _buildCriteria(filterBy) {
//   if (filterBy.userId) {
//     return { userId: ObjectId(filterBy.userId) }
//   } else if (filterBy.toyId) {
//     return { toyId: ObjectId(filterBy.toyId) }
//   }
//   return {}
// }
