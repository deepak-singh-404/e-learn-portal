const express = require('express');
const multer = require('multer');
const courseController = require('../controllers/courseController')

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 }
});


router.post('/', courseController.createCourse);
router.put('/:courseId', courseController.updateCourse);
router.get('/:courseId', courseController.fetchCourse);
router.get('/', courseController.fetchCourses);
router.delete('/:courseId', courseController.deleteCourse);
router.post('/upload', upload.single('video'), courseController.uploadVideoFile)

module.exports = router;