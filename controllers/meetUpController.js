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

        if (!title || !description || !date || !location || !maxParticipants) {
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

        res.status(200).json({ status: "success", data: { newMeetUp } });
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

meetUpController.updateMeetUp = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            date,
            category,
            image,
            maxParticipants,
            location,
        } = req.body;

        const updateData = {
            title,
            description,
            date,
            category,
            image,
            maxParticipants,
            location,
        };

        const updatedMeetUp = await MeetUp.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedMeetUp) {
            throw new Error("meetUp 수정을 실패했습니다");
        }

        res.status(200).json({ status: "success", data: { updatedMeetUp } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

meetUpController.getAllMeetUp = async (req, res) => {
    try {
        const allMeetUp = await MeetUp.find({ isDelete: false }).populate(
            "organizer"
        );

        if (allMeetUp.length === 0) {
            throw new Error("meetUp이 존재하지 않습니다");
        }

        res.status(200).json({ status: "success", data: { allMeetUp } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

meetUpController.deleteMeetUp = async (req, res) => {
    try {
        const { id } = req.params;
        const meetUp = await MeetUp.findById(id);

        if (!meetUp) throw new Error("meetUp 삭제를 실패했습니다");

        meetUp.isDelete = true;

        await meetUp.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

meetUpController.joinMeetUp = async (req, res) => {
    try {
        const { userId } = req;
        const { meetUpId } = req.body;

        const meetUp = await MeetUp.findById(meetUpId);

        if (!meetUp) {
            throw new Error("MeetUp이 존재하지 않습니다");
        }

        if (meetUp.participants.length >= meetUp.maxParticipants) {
            throw new Error("참가 인원이 가득 찼습니다");
        }

        if (!meetUp.participants.includes(userId)) {
            meetUp.participants.push(userId);
        } else {
            throw new Error("이미 참가한 유저입니다");
        }

        await meetUp.save();

        res.status(200).json({ status: "success", data: { meetUp } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = meetUpController;
