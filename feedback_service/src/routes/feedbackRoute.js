const express = require('express');
const feedbackController = require('../controllers/feedbackController')

const router = express.Router();

router.post("/review", feedbackController.postReview)
router.post("/qna", feedbackController.postQna)

module.exports = router;