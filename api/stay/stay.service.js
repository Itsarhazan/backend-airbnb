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
    // by type
    // if (filterBy.propertyType) {
    //     criteria.roomType = { $all: filterBy.propertyType }
    // }


// const regex = new RegExp(filterBy.city, 'i')
// console.log(regex);
// criteria.address = { city: { $regex: regex, $options: 'i' } }
//     // new RegExp(filterBy.city, 'i')
//     // criteria.address = { city: { $regex: filterBy.city, $options: 'i' } }

// console.log('criteria from _buildCriteria', criteria);
// if (filterBy.city) {
//     criteria.city = { $regex: filterBy.city, $options: 'i' }
// }

// if (filterBy.amenities && filterBy.amenities.length) {
//     criteria.amenities = { $in: filterBy.amenities }
//     criteria.amenities = { $all: filterBy.amenities }
// }
// let filteredStays = JSON.parse(JSON.stringify(stays))

// if (filterBy.name) {
//     criteria.name = { $regex: filterBy.name, $options: 'i' }
// }

// if (filterBy.capacity) {
//     criteria.capacity = filteredStays.filter(stay => stay.capacity >= filterBy.capacity)
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

// if (filterBy.amenities) {
//     filteredStays = filteredStays.filter((stay) => {
//         return filterBy.amenities.every((amenity) => stay.amenities.includes(amenity))
//     })
// }





// if (filterBy.inStock) {
//     const inStock = filterBy.inStock === 'true' ? true : false
//     criteria.inStock = { $eq: inStock }
// }
// if (filterBy.labels && filterBy.labels.length) {
//     criteria.labels = { $in: filterBy.labels }
//         // criteria.labels = { $all: filterBy.labels }
// }


// function _sort(stays, sortBy) {
//     if (!sortBy) return

//     switch (sortBy) {
//         case 'createdAt':
//             stays.sort((t1, t2) => t1.createdAt - t2.createdAt)
//             break
//         case 'name':
//             stays.sort((t1, t2) => t1.name.localeCompare(t2.name))
//             break
//         case 'price':
//             stays.sort((t1, t2) => t1.price - t2.price)
//             break
//     }
// }
module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}