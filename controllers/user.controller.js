const User = require("../model/User");
const bcrypt = require("bcryptjs");
const userController = {};
const Post = require("../model/Post");

userController.createUser = async (req, res) => {
    try {
        const { email, userName, password, gender } = req.body;

        // 데이터 검증
        if (!userName || !email || !password || !gender) {
            throw new Error("필수 입력 항목이 누락되었습니다");
        }

        //이메일 중복 확인
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw new Error("이미 존재하는 이메일입니다");
        }

        // 비밀번호 해시 처리
        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(password, salt);

        // 새로운 유저 생성
        const newUser = new User({
            userName,
            email,
            password: hash,
            gender,
        });

        await newUser.save();

        res.status(200).json({ status: "success", message: "유저 생성 완료" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        res.status(200).json({ status: "success", data: { user } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.getAllUser = async (req, res) => {
    try {
        const allUser = await User.find({});
        res.status(200).json({ status: "success", data: { allUser } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.updateUser = async (req, res) => {
    try {
        const { userId } = req;
        const { userName, stacks, originalPassword, newPassword, profileImage, description } = req.body;
        const user = await User.findById(userId);

        if (!originalPassword) {
            throw new Error("비밀번호를 입력해주세요.");
        }

        const isMatch = await bcrypt.compare(originalPassword, user.password);

        if (!isMatch) {
            throw new Error("비밀번호가 틀렸습니다.");
        }

        if (!userName || userName === "") {
            throw new Error("이름을 입력해주세요.");
        }

        if(stacks.length !== 0) {
            user.stacks = stacks;
        } else {
            user.stacks = ['none'];
        }

        user.userName = userName;
        user.profileImage = profileImage;
        user.description = description;

        if (newPassword) {
            // 비밀번호 해시 처리
            const salt = bcrypt.genSaltSync(10);
            const hash = await bcrypt.hash(newPassword, salt);
            user.password = hash;
        }

        await user.save();

        res.status(200).json({ status: "success", data: { user } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.getUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const userPost = await Post.find({ author: id });
        const user = await User.findById(id);

        if (!userPost) throw new Error("포스트를 찾을 수 없습니다");

        res.status(200).json({ status: "success", data: { user, userPost } });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.reportUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) throw new Error("유저를 찾을 수 없습니다");

        user.report += 1;

        await user.save();
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) throw new Error("유저를 찾을 수 없습니다");

        user.block = true;

        await user.save();

        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

userController.getUserByNickName = async (req, res) => {
    try {
        const { nickName } = req.params;
        const uniqueUser = await User.findOne({ nickName })
        if (!uniqueUser) {
            throw new Error("사용자를 찾을 수 없습니다")
        }
        const uniqueUserPost = await Post.find({ author: uniqueUser._id })
        res.status(200).json({ status: "success", data: { uniqueUser, uniqueUserPost } })
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message})
    }
}

userController.followUser = async (req, res) => {
    try {
        const { userId } = req;
        const { nickName } = req.params;

        const user = await User.findById(userId);
        const targetUser = await User.findOne({ nickName })
        
        if (!user || !targetUser) {
            throw new Error("유저를 찾을 수 없습니다.");
        }

        if (user.following.includes(targetUser._id)) {
            throw new Error("이미 팔로우 중입니다");
        }

        await user.follow(targetUser._id);
        targetUser.followers.push(userId);
        await targetUser.save();
        
        res.status(200).json({status: "success"})
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message})
    }
}

userController.unfollowUser = async (req, res) => {
    try {
        const { userId } = req;
        const { nickName } = req.params;

        const user = await User.findById(userId);
        const targetUser = await User.findOne({ nickName })
        
        if (!user || !targetUser) {
            throw new Error("유저를 찾을 수 없습니다")
        }

        if (!user.following.includes(targetUser._id)) {
            throw new Error("팔로우 중이 아닙니다");
        }

        await user.unfollow(targetUser._id);
        targetUser.followers = targetUser.followers.filter(
            (followerId) => followerId.toString() !== userId.toString()
        )
        await targetUser.save();

        res.status(200).json({ status: "success"})
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message})
    }
}

module.exports = userController;
