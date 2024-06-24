const QnA = require("../model/QnA");
const { getUserByNickName } = require("./user.controller");

const qnaController = {};

qnaController.createQnA = async (req, res) => {
    try {
        const { userId } = req;
        const { title, content, tags } = req.body;

        if (!title || !content || !tags) {
            throw new Error("필수 항목이 누락되었습니다");
        }

        if (tags.length > 10) {
            throw new Error("태그는 10개까지 입력 가능합니다");
        }

        const newQnA = new QnA({
            author: userId,
            title,
            content,
            tags,
        });

        await newQnA.save();

        res.status(200).json({ status: "success", data: { newQnA } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

qnaController.getQnA = async (req, res) => {
    try {
        const { id } = req.params;
        const qna = await QnA.findById(id)
            .populate({ path: "author", select: "userName profileImage" })
            .populate({
                path: "answers.author",
                select: "userName profileImage",
            });

        if (!qna || qna.isDelete) {
            throw new Error("QnA가 존재하지 않습니다");
        }

        res.status(200).json({ status: "success", data: { qna } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = qnaController;
