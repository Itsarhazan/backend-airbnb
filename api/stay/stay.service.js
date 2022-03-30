const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


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
  // const stays = await storageService.query(KEY)
    // let filteredStays = JSON.parse(JSON.stringify(stays))

    // if (filterBy.city) {
    //     const regex = new RegExp(filterBy.city, 'i')
    //     filteredStays = filteredStays.filter(stay => regex.test(stay.address.city))
    // }

    // if (filterBy.capacity) {
    //     filteredStays = filteredStays.filter(stay => stay.capacity >= filterBy.capacity)
    // }

    // if (filterBy.price) {
    //     filteredStays = filteredStays.filter(
    //         (stay) => filterBy.price[0] < stay.price && stay.price < filterBy.price[1]
    //     )
    // }

    // if (filterBy.roomType) {
    //     const regex = new RegExp(filterBy.roomType, 'i')
    //     filteredStays = filteredStays.filter(stay => regex.test(stay.roomType))
    // }

    // console.log('filterBy SERVICE:', filterBy);
    // if (filterBy.amenities) {
    //     filteredStays = filteredStays.filter((stay) => {
    //         return filterBy.amenities.every((amenity) => stay.amenities.includes(amenity))
    //     })
    //     console.log('filteredStays.length in amenities:', filteredStays.length);
    // }

    // return Promise.resolve(filteredStays)



 
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