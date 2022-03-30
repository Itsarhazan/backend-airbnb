const fs = require('fs')
const { utilService } = require('./utilService')
const gStays = require('../data/stay.json')

function query(filterBy = {}) {
    const stays = _filterStays(filterBy)
    return Promise.resolve(stays)
}

function getById(stayId) {
    return new Promise((resolve, reject) => {
        const stay = gStays.find(stay => stay._id === stayId)
        if (stay) return resolve(stay)
        reject(`No stay with id === ${stayId} was found`)
    })
}

function save({ _id, name, price, labels, inStock, createdAt = Date.now() }) {
    const stayToSave = {
        _id,
        name,
        price,
        labels,
        inStock,
        createdAt,
    }
    if (_id) {
        console.log(stayToSave)
        const idx = gStays.findIndex(stay => stay._id === _id)
        gStays[idx] = stayToSave
    } else {
        // CREATE
        stayToSave._id = utilService.makeExtId()
        gStays.unshift(stayToSave)
    }
    return _saveStaysToFile()
        .then(() => stayToSave)
}

function remove(stayId, loggedinUser) {
    return new Promise((resolve, reject) => {
        const idx = gStays.findIndex(stay => stay._id === stayId)
        if (idx === -1) return reject('No such stay')
        gStays.splice(idx, 1)
        _saveStaysToFile()
            .then(resolve)
    })
}


function _filterStays(filterBy) {
    let filteredStays = []

    // filter by name
    const regex = new RegExp(filterBy.city, 'i')
    filteredStays = gStays.filter((stay) => regex.test(stay.city))
        // const regex = new RegExp(filterBy.name, 'i')
        // let filteredStays = gStays.filter(stay => regex.test(stay.name))

    // //filter by inStock
    // if (filterBy.inStock) {
    //     filteredStays = filteredStays.filter(stay => {
    //         return stay.inStock === JSON.parse(filterBy.inStock)
    //     })
    // }

    // //filter by labels
    // if (filterBy.labels.length) {
    //     filteredStays = filteredStays.filter(stay => {
    //         return stay.labels.some(label => filterBy.labels.includes(label))
    //     })
    // }

    // //sorting
    // if (filterBy.sortBy) {
    //     filteredStays.autoSortObj(filterBy.sortBy)
    // }

    return filteredStays
}

function _saveStaysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/stay.json', JSON.stringify(gStays, null, 2), (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _makeId(length = 5) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
module.exports = {
    save,
    query,
    remove,
    getById,
}