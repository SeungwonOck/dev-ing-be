const mongoose = require("mongoose");
const formatDateTime = require("../utils/formatDateTime");
const Schema = mongoose.Schema;

// 모델들을 불러옵니다
const Post = require("./Post");
const MeetUp = require("./MeetUp");
const QnA = require("./QnA");

const reportSchema = Schema({
    reporter: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    reported: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Types.ObjectId, required: true },
    contentType: { type: String, enum: ["Post", "MeetUp", "QnA"], required: true },
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

// content 필드에 대한 refPath 설정
reportSchema.path('content').validate(function(value) {
    const validContentTypes = ["Post", "MeetUp", "QnA"];
    return validContentTypes.includes(this.contentType);
}, 'Invalid contentType');

// contentType에 따라 content 필드가 참조할 모델을 동적으로 설정
reportSchema.pre('save', async function(next) {
    try {
        let model;
        switch (this.contentType) {
            case 'Post':
                model = Post;
                break;
            case 'MeetUp':
                model = MeetUp;
                break;
            case 'QnA':
                model = QnA;
                break;
            default:
                throw new Error('Invalid contentType');
        }
        if (!model) {
            throw new Error('Model not found');
        }
        const doc = await model.findById(this.content);
        if (!doc) {
            throw new Error('Content document not found');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;