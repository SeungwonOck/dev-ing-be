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

qnaController.updateQnA = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image, tags } = req.body;

        const updateData = {
            title,
            content,
            image,
            tags,
        };

        const updatedQnA = await QnA.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedQnA) {
            throw new Error("QnA 수정을 실패했습니다");
        }

        res.status(200).json({ status: "success", data: { updatedQnA } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

qnaController.deleteQnA = async (req, res) => {
    try {
        const { id } = req.params;
        const qna = await QnA.findById(id);

        if (!qna) throw new Error("포스트가 존재하지 않습니다");

        qna.isDelete = true;
        await qna.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

qnaController.createAnswer = async (req, res) => {
    try {
        const { userId } = req;
        const { qnaId, content, image } = req.body;

        const qna = await QnA.findById(qnaId);

        if (!qna) throw new Error("포스트가 존재하지 않습니다");

        const newAnswer = {
            author: userId,
            content,
            image,
        };
        qna.answers.push(newAnswer);
        qna.answerCount = qna.answers.length;

        await qna.save();
        res.status(200).json({ status: "success", data: { newAnswer } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

qnaController.updateAnswer = async (req, res) => {
    try {
        const { userId } = req;
        const { content, image } = req.body;
        const { qnaId, answerId } = req.params;

        // 구조 분해 할당을 통해 업데이트할 데이터 정의
        const updateData = {
            content,
            image,
            isUpdated: true,
        };

        // QnA ID로 해당 QnA 문서를 찾음
        const qna = await QnA.findById(qnaId);

        // QnA가 존재하지 않거나 삭제된 상태라면 에러
        if (!qna || qna.isDelete) {
            throw new Error("해당 QnA가 존재하지 않습니다");
        }

        // QnA에서 해당 댓글을 찾음
        const answer = qna.answers.id(answerId);

        // 댓글의 작성자와 현재 유저가 일치하지 않으면 권한 없음 에러
        if (answer.author.toString() !== userId) {
            throw new Error("댓글 수정 권한이 없습니다");
        }

        if (!qna) {
            throw new Error("댓글 수정을 실패했습니다");
        }

        answer.set(updateData);

        res.status(200).json({ status: "success", data: { qna } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = qnaController;
