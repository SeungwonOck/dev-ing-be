const chatController = {};
const ChatRoom = require("../model/ChatRoom");

chatController.createChatRoom = async (req, res) => {
    try {
        const { roomId, organizerId, participants } = req.body;

        if (!roomId || !organizerId || !participants) {
            throw new Error("필수 항목이 누락되었습니다");
        }

        const chatRoom = new ChatRoom({
            roomId,
            organizer: organizerId,
            participants,
        });

        await chatRoom.save();
        res.status(200).json({ status: "success", data: { chatRoom } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

chatController.getChatRoomList = async (req, res) => {
    try {
        const { userId } = req;

        let chatRooms = await ChatRoom.find({
            participants: { $elemMatch: { $eq: userId } },
        });

        if (chatRooms.length === 0) {
            throw new Error("생성된 채팅방이 없습니다");
        }

        chatRooms = await Promise.all(
            chatRooms.map(async (chatRoom) => {
                await chatRoom.populate({ path: "roomId", select: "title" });
                await chatRoom.populate({ path: "organizer", select: "_id" });
                await chatRoom.populate({
                    path: "participants",
                    select: "nickName profileImage",
                });
                return chatRoom;
            })
        );

        res.status(200).json({ status: "success", data: { chatRooms } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

chatController.getChatRoom = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id', id, typeof id)

        const chatRoom = await ChatRoom.findOne({ roomId: id }).populate({
            path: "roomId",
            select: "title",
        });

        console.log('chatRoom', chatRoom)

        if (!chatRoom) {
            throw new Error("채팅방을 찾을 수 없습니다");
        }

        res.status(200).json({ status: "success", data: { chatRoom } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

chatController.saveChatMessage = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const { userName, message, image } = req.body;

        const chatRoom = await ChatRoom.findOne({ roomId: id });

        const newChat = {
            userName,
            message,
            image,
        };

        chatRoom.chat.push(newChat);

        await chatRoom.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = chatController;
