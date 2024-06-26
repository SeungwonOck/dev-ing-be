const mongoose = require("mongoose");
const formatDateTime = require("../utils/formatDateTime");
const Schema = mongoose.Schema;

const reportSchema = Schema({
    reporter: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    reported: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Types.ObjectId, required: true },
    contentType: { type: String, enum: ["post", "meetup", "qna"], required: true },
    reasons: [{ type: String, required: true }],
    isConfirmed: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
});

reportSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.updateAt;
    delete obj.__v;
    obj.createAt = formatDateTime(obj.createAt);
    return obj;
};

module.exports = mongoose.model("Report", reportSchema);