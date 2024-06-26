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

        let content;
        switch (contentType) {
            case 'post':
                content = await Post.findById(contentId);
                if (!content) throw new Error('신고 대상 게시글이 존재하지 않습니다.');
                break;
            case 'meetup':
                content = await MeetUp.findById(contentId);
                if (!content) throw new Error('신고 대상 모임이 존재하지 않습니다.');
                break;
            case 'qna':
                content = await QnA.findById(contentId);
                if (!content) throw new Error('신고 대상 질문이 존재하지 않습니다.');
                break;
            default:
                throw new Error('올바른 콘텐츠 유형이 아닙니다.');
        }

        const newReport = new Report({
            reporter: userId,
            reported: reportedUserId,
            content: content._id,
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
            .populate({ path: "content" });

        for (let report of reportList) {
            let contentModel;
            switch (report.contentType) {
                case 'post':
                    contentModel = await Post.findById(report.content);
                    break;
                case 'meetup':
                    contentModel = await MeetUp.findById(report.content);
                    break;
                case 'qna':
                    contentModel = await QnA.findById(report.content);
                    break;
                default:
                    throw new Error('올바른 콘텐츠 유형이 아닙니다.');
            }
            if (contentModel) {
                report.content = contentModel
            }
        }

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