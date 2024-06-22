const MeetUp = require("../model/MeetUp");
const meetUpController = {};
const parseDate = require("../utils/parseDate");
const formatDateTime = require("../utils/formatDateTime");

meetUpController.createMeetUp = async (req, res) => {
    try {
        const { userId } = req;
        const {
            title,
            description,
            date,
            category,
            image,
            location,
            maxParticipants,
        } = req.body;

        if (!title || !description || !date || !image || !maxParticipants) {
            throw new Error("필수 항목이 누락되었습니다");
        }

        const newMeetUp = new MeetUp({
            organizer: userId,
            title,
            description,
            date: parseDate(date),
            category,
            image,
            location,
            maxParticipants,
        });

        await newMeetUp.save();

        res.status(200).json({ status: "success", date: { newMeetUp } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

meetUpController.getMeetUp = async (req, res) => {
    try {
        const { id } = req.params;
        const meetUp = await MeetUp.findById(id);

        if (!meetUp) throw new Error("meetUp 찾기를 실패했습니다");

        res.status(200).json({ status: "success", data: { meetUp } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = meetUpController;
