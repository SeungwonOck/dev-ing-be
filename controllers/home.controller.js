const Post = require("../model/Post");

const homeController = {};

homeController.getHomeData = async (req, res) => {
    try {
        const homePost = await Post.find({ isDelete: false })
            .sort({ likes: -1 })
            .limit(3)
            .populate("author")

        if (!homePost.length) {
            throw new Error("포스트가 존재하지 않습니다");
        }

        return res.status(200).json({ status: "success", data: { homePost } })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = homeController;