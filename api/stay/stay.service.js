const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

// const fs = require('fs');
// const gStays = require('../../data/stay.json');

// function query() {
//     return Promise.resolve(gStays)
// }
async function query(filterBy) {
    console.log('filterBy', filterBy);
    try {
        const criteria = _buildCriteria(filterBy)
        console.log(criteria)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        _sort(stays, filterBy.sortBy)
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    return dbService.getCollection('stay')
        .then(collection => collection.deleteOne({ '_id': ObjectId(stayId) })
            .then(() => stayId))
        .catch(err => {
            logger.error(`cannot remove stay ${stayId}`, err)
            throw err
        })

    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}
async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ "_id": id }, { $set: {...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.inStock) {
        const inStock = filterBy.inStock === 'true' ? true : false
        criteria.inStock = { $eq: inStock }
    }
    if (filterBy.labels && filterBy.labels.length) {
        criteria.labels = { $in: filterBy.labels }
            // criteria.labels = { $all: filterBy.labels }
    }
    return criteria
}

function _sort(stays, sortBy) {
    if (!sortBy) return

    switch (sortBy) {
        case 'createdAt':
            stays.sort((t1, t2) => t1.createdAt - t2.createdAt)
            break
        case 'name':
            stays.sort((t1, t2) => t1.name.localeCompare(t2.name))
            break
        case 'price':
            stays.sort((t1, t2) => t1.price - t2.price)
            break
    }
}
module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}