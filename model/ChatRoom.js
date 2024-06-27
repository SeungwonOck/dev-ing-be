const mongoose = require("mongoose");
const { Schema } = mongoose;
const formatDateTime = require("../utils/formatDateTime");

const chatSchema = Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    image: { type: String },
    createAt: { type: Date, default: Date.now },
});

const chatRoomSchema = Schema({
    roomId: { type: mongoose.Types.ObjectId, ref: "MeetUp" },
    organizer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    participants: [
        { type: mongoose.Types.ObjectId, ref: "User", required: true },
    ],
    chat: [chatSchema],
});

//chatSchema 를 저장하기 전 미들웨어로 organizer를 participants에 넣음
chatRoomSchema.pre("save", function (next) {
    if (!this.participants.includes(this.organizer)) {
        this.participants.push(this.organizer);
    }
    next();
});

chatRoomSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.chat.map((chat) => {
        chat.createAt = formatDateTime(chat.createAt);
    });
    delete obj.__v;
    return obj;
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
