const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    content: {
        videoLectures: [{ title: String, url: String }],
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
