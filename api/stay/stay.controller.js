const stayService = require('./stay.service.js')
const logger = require('../../services/logger.service')

// GET LIST
async function getStays(req, res) {
    try {
        const filterBy = req.query
            // console.log('filterBy from getStays', filterBy);
        const stays = await stayService.query(filterBy)
            // console.log('stays from getStays', stays);
        res.json(stays)
    } catch (err) {
        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

// GET BY ID 
async function getStayById(req, res) {
    try {
        const stay = await stayService.getById(req.params.id)
        res.json(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

// POST (add stay)
async function addStay(req, res) {
    try {
        const addedStay = await stayService.add(req.body)
        res.json(addedStay)
    } catch (err) {
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

// PUT (Update stay)
async function updateStay(req, res) {
    try {
        const updatedStay = await stayService.update(req.body)
        res.json(updatedStay)
    } catch (err) {
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })

    }
}

// DELETE (Remove stay)
async function removeStay(req, res) {
    try {
        const removedId = await stayService.remove(req.params.id)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove stay', err)
        res.status(500).send({ err: 'Failed to remove stay' })
    }
}

module.exports = {
    getStays,
    getStayById,
    addStay,
    updateStay,
    removeStay,
}