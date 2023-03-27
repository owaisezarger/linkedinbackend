const express = require("express");
const { UserModal } = require("../modals/Users.modal");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
var jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModal.find();
    res.send(users);
  } catch (err) {
    res.send({ msg: "Please Login", error: err.message });
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, pass, age, city, isMarried } = req.body;
  const alreadyUser = await UserModal.find({ email });
  try {
    if (alreadyUser.length == 0) {
      bcrypt.hash(pass, 5, async (err, hash) => {
        if (err) {
          console.log({ msg: err.message });
        } else {
          const user = new UserModal({
            name,
            email,
            gender,
            pass: hash,
            age,
            city,
            isMarried,
          });
          await user.save();
          res.status(202).send({ msg: "New User has been Regsitered" });
        }
      });
    } else {
      console.log("User already exist ");
      res.send({ msg: err.message });
    }
  } catch (err) {
    res.send({ msg: "User Already exists Please login ", error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModal.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user[0]._id }, process.env.key);
          console.log(user[0]._id);
          res.send({ MSG: "Logged In Successfully", token: token });
        } else {
          res.send({ msg: "wrong credentials" });
        }
      });
    } else {
      res.send({ msg: "wrong credentials" });
    }
  } catch (e) {
    res.send({ msg: "Something went wrong", err: e.message });
  }
});

module.exports = {
  userRouter,
};
