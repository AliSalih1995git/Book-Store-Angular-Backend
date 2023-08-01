const UserModel = require("../models/UserModel");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authUser } = require("../middlware/auth");

//REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const check = await UserModel.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "This email already Exist, Try a differetn email address",
      });
    }
    const cryptePassword = await bcrypt.hash(password, 12);
    const user = await new UserModel({
      fullname,
      email,
      password: cryptePassword,
    }).save();
    res.send({
      message: "Register Successfull",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Could not find User",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Incorrect Password,Please try again",
      });
    }
    const token = jwt.sign(
      { id: user._id, fullname: user.fullname },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.send({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      token: "Bearer " + token,
      message: "Logged in Successfully",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.get("/profile", authUser, async (req, res) => {
  try {
    const check = await UserModel.findById(req.user.id);

    const { password, ...other } = check.toObject();

    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
module.exports = router;
