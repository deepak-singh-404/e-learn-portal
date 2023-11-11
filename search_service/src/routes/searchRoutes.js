const express = require('express');
const searchController = require('../controllers/searchController')

const router = express.Router();

router.get("/courses", searchController.searchCourse)

module.exports = router;