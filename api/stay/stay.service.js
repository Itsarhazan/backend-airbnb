const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        // _sort(stays, filterBy.sortBy)
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
    let criteria = {}
    console.log('filterBy', filterBy);

    // by name
    if (filterBy.city) {
        criteria['address.city'] = { $regex: filterBy.city, $options: 'i' }
    }

    // by amenities
    if (filterBy.amenities && filterBy.amenities.length) {
        criteria.amenities = { $in: filterBy.amenities }
        criteria.amenities = { $all: filterBy.amenities }
    }
    
    // by price
        if (filterBy.price) {
            console.log('filterBy.price',filterBy.price);
            criteria.price = ( {$gte: +filterBy.price[0], $lte: +filterBy.price[1]})
        }  

console.log('criteria:', criteria)
return criteria
}
   
module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}