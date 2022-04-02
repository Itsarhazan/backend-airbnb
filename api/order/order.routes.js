const express = require('express')
const { getOrders, addOrder } = require('./order.controller')
const router = express.Router()

router.get('/', getOrders)
router.post('/', addOrder)


module.exports = router
