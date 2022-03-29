const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getReviews, addReview, deleteReview } = require('./review.controller')
const router = express.Router()

router.get('/', getReviews)
router.post('/', addReview)
router.delete('/:id', requireAuth, deleteReview)

module.exports = router
