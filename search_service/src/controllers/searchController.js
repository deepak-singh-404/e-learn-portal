const Course = require('../models/course');

const searchCourse = async (req, res) => {
    try {
        const { str } = req.query
        // Construct the search query dynamically
        const searchQuery = {
            $or: [
                { title: { $regex: str, $options: 'i' } },
                { description: { $regex: str, $options: 'i' } },
                { instructor: { $regex: str, $options: 'i' } }
            ],
        };

        const courses = await Course.find(searchQuery)
        res.status(200).json({ status: true, data: courses })
    }
    catch (error) {
        console.log(error)
        throw error
    }
}


module.exports = { searchCourse }