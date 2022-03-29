const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const userService = require('../user/user.service')

module.exports = {
  query,
  addReview,
  remove,
}

async function query(filterBy = {}) {
  const collection = await dbService.getCollection('review')

  const reviews = await collection
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

  return reviews
}

async function addReview(review) {
  const reviewToAdd = {
    userId: ObjectId(review.userId),
    toyId: ObjectId(review.toyId),
    content: review.content,
    rate: review.rate,
  }

  const collection = await dbService.getCollection('review')
  const addedReview = await collection.insertOne(reviewToAdd)

  reviewToAdd._id = addedReview.insertedId
  return reviewToAdd
}

async function remove(reviewId) {
  try {
    const collection = await dbService.getCollection('review')
    const criteria = { _id: ObjectId(reviewId) }
    await collection.deleteOne(criteria)
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  if (filterBy.userId) {
    return { userId: ObjectId(filterBy.userId) }
  } else if (filterBy.toyId) {
    return { toyId: ObjectId(filterBy.toyId) }
  }
  return {}
}
