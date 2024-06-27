const chatController = {};
const ChatRoom = require("../model/ChatRoom");

chatController.createChatRoom = async (req, res) => {
    try {
        const { organizer, participants } = req.body;

        if (!organizer || !participants) {
            throw new Error("필수 항목이 누락되었습니다");
        }

        const chatRoom = new ChatRoom({
            organizer,
            participants,
        });

        await chatRoom.save();
        res.status(200).json({ status: "success", data: { chatRoom } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = chatController;
