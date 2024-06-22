const mongoose = require("mongoose");
const formatDateTime = require("../utils/formatDateTime");
const Schema = mongoose.Schema;
const commentSchema = require("./Comment");

const postSchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    tags: [{ type: String }],
    userLikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    likes: { type: Number, default: 0 },
    isDelete: { type: Boolean, default: false },
    comments: [commentSchema],
    createAt: { type: Date, default: Date.now },
});

postSchema.methods.addLike = async function (userId) {
    if (!this.userLikes.includes(userId)) {
        this.userLikes.push(userId);
        this.likes += 1;
        await this.save();
    }
};

postSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.updateAt;
    delete obj.__v;
    obj.comments.map((comment) => {
        comment.createAt = formatDateTime(comment.createAt)
    })
    return obj;
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
