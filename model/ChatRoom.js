const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    image: { type: String },
    createAt: { type: Date, default: Date.now },
});

const chatRoom = Schema({
    roomId: { type: mongoose.Types.ObjectId, ref: "MeetUp" },
    organizer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    participants: [
        { type: mongoose.Types.ObjectId, ref: "User", required: true },
    ],
    chat: [chatSchema],
});

module.exports = mongoose.model("ChatRoom", chatRoom);
