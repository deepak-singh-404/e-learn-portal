const Feedback = require('../models/feedback');

const postReview = async (req, res) => {
    try {
        const { userId, courseId, content } = req.body;
        const review = new Feedback({
            userId,
            courseId,
            type: 'review',
            content,
        });
        await review.save();
        res.status(200).json({ status: true, message: 'Review posted successfully', data: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

const postQna = async (req, res) => {
    try {
        const { userId, courseId, content } = req.body;
        const qna = new Feedback({
            userId,
            courseId,
            type: 'qna',
            content,
        });
        await qna.save();
        res.status(200).json({ status: true, message: 'Q&A posted successfully', data: qna });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

module.exports = { postReview, postQna }