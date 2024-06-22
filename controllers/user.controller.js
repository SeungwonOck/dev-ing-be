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
        const { userName, specs, originalPassword, newPassword, profileImage } =
            req.body;
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

        user.userName = userName;
        user.specs = specs;
        user.profileImage = profileImage;

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

module.exports = userController;
