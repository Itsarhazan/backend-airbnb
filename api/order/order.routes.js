const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getOrders, addOrder, deleteOrder } = require('./order.controller')
const router = express.Router()

router.get('/', getOrders)
router.post('/', addOrder)
router.delete('/:id', requireAuth, deleteOrder)

module.exports = router
