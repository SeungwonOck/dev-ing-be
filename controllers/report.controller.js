const mongoose = require("mongoose");
const reportController = {};
const formatDateTime = require("../utils/formatDateTime");
const User = require("../model/User");
const Report = require("../model/Report");
const Post = require("../model/Post");
const MeetUp = require("../model/MeetUp");
const QnA = require("../model/QnA");

reportController.createReport = async (req, res) => {
    try {
        const { userId } = req;
        const { reportedUserId, contentId, contentType, reasons } = req.body;

        const reporterUser = await User.findById(userId);
        if(!reporterUser) throw new Error('신고 권한이 없습니다. 로그인해주세요.');

        const reportedUser = await User.findById(reportedUserId);
        if (!reportedUser) throw new Error('신고 대상 사용자가 존재하지 않습니다.');

        const previousReport = await Report.find({ reporter: userId, contentId: contentId });
        if(previousReport.length > 0) throw new Error('이미 신고한 게시글입니다.')

        const newReport = new Report({
            reporter: userId,
            reported: reportedUserId,
            content: contentId,
            contentType: contentType,
            reasons: reasons,
            isConfirmed: false
        });

        await newReport.save();

        res.status(200).json({ status: 'success', message: '신고가 성공적으로 접수되었습니다.', data: { report: newReport } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

reportController.getAllReport = async (req, res) => {
    try {
        const reportList = await Report.find({})
            .populate({
                path: "reported",
                select: "nickName"
            })
            .populate({
                path: "reporter",
                select: "nickName"
            })
            .populate({
                path: "content",
                // contentType에 따라서 적절한 모델을 참조하도록 설정합니다
                match: { contentType: { $in: ["Post", "MeetUp", "QnA"] } },
                select: "title" // 예를 들어 Post 모델의 title 필드를 선택할 수 있습니다
            });

        if(reportList.length === 0) {
            throw new Error("신고 내역이 존재하지 않습니다");
        }

        res.status(200).json({ status: 'success', data: { reportList } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

reportController.updateReport = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
};

module.exports = reportController;