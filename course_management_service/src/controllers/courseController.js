const multer = require('multer');
const AWS = require('aws-sdk');
const Course = require('../models/course');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { title, description, instructor, content } = req.body;

        const newCourse = new Course({
            title,
            description,
            instructor,
            content,
        });

        await newCourse.save();

        res.status(201).json({ status: true, message: 'Course created successfully', data: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Update an existing course
const updateCourse = async (req, res) => {
    try {
        const { title, description, content } = req.body;
        const { courseId } = req.params;

        // Validate that the course exists
        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ status: false, message: 'Course not found' });
        }

        // Update the course details
        existingCourse.title = title || existingCourse.title;
        existingCourse.description = description || existingCourse.description;
        existingCourse.content = content || existingCourse.content;

        await existingCourse.save();

        res.status(200).json({ status: true, message: 'Course updated successfully', data: existingCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate that the course exists
        const existingCourse = await Course.findByIdAndDelete(courseId)
        if (!existingCourse) {
            return res.status(404).json({ status: false, message: 'Course not found' });
        }
        res.status(200).json({ status: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Get course details
const fetchCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate that the course exists
        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ status: false, message: 'Course not found' });
        }

        res.status(200).json({ status: true, data: existingCourse });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

// Get course details
const fetchCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ status: true, data: courses });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

//Upload
const uploadVideoFile = async (req, res) => {
    try {
        // Ensure that a file is present in the request
        if (!req.file) {
            return res.status(400).json({ status: false, message: 'No file provided' });
        }

        // Create a stream from the uploaded file
        const fileStream = req.file.buffer;

        // Generate a unique filename (you may want to use a library like `uuid` for this)
        const fileName = `sample-videos/${Date.now()}_${req.file.originalname}`;

        // Upload the file to S3
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
            ACL: 'public-read', // Set ACL to 'public-read' for public access
        };

        const result = await s3.upload(uploadParams).promise();

        // Get the public URL of the uploaded file
        const fileUrl = result.Location;

        res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}



module.exports = { createCourse, updateCourse, deleteCourse, fetchCourse, fetchCourses, uploadVideoFile }