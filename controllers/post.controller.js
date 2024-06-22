const mongoose = require("mongoose");
const postController = {};
const Post = require("../model/Post");
const formatDateTime = require("../utils/formatDateTime");
const convertToObjectId = require("../utils/convertToObjectId");

postController.createPost = async (req, res) => {
    try {
        const { userId } = req;

        const { title, content, image, tags } = req.body;

        if (!title || !content) {
            throw new Error("필수 입력 항목이 누락되었습니다");
        }

        if (tags.length > 10) {
            throw new Error("태그는 10개까지 입력 가능합니다");
        }

        const newPost = new Post({
            author: userId,
            title,
            content,
            image,
            tags,
        });

        await newPost.save();

        res.status(200).json({ status: "success", data: { newPost } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author");

        if (!post) throw new Error("포스트가 존재하지 않습니다");

        res.status(200).json({ status: "success", data: { post } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image, tags } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (image) updateData.image = image;
        if (tags) updateData.tags = tags;

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate();

        if (!updatedPost) {
            throw new Error("포스트 수정을 실패했습니다");
        }

        res.status(200).json({ status: "success", data: { updatedPost } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) throw new Error("포스트가 존재하지 않습니다");

        post.isDelete = true;
        await post.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.getAllPost = async (req, res) => {
    try {
        const allPost = await Post.find({ isDelete: false }).populate("author")
        .populate({
            path: "comments.author",
            model: "User"
        });;

        if (!allPost.length) {
            throw new Error("포스트가 존재하지 않습니다");
        }

        res.status(200).json({ status: "success", data: { allPost } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.incrementLikesAndAddUser = async (req, res) => {
    try {
        const { userId } = req;
        const { postId } = req.body;

        const post = await Post.findById(postId).populate("author");

        if (!post) throw new Error("포스트가 존재하지 않습니다");

        await post.addLike(userId);

        res.status(200).json({ status: "success", data: { post } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

postController.createComment = async (req, res) => {
    try {
        const { userId } = req;
        const { postId, content } = req.body;

        const post = await Post.findById(postId);

        if (!post) throw new Error("포스트가 존재하지 않습니다");

        const newComment = {
            author: userId,
            content: content,
        };
        post.comments.push(newComment);

        await post.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = postController;
