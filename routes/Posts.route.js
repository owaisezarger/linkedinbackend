const express = require("express");
const { PostModal } = require("../modals/Posts.modal");
require("dotenv").config();

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const device = req.query.device;

  if (device) {
    try {
      let post = await PostModal.find({ device: device });
      res.send(post);
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const posts = await PostModal.find();
      res.send(posts);
    } catch (err) {
      res.send({ msg: "Please Login", error: err.message });
    }
  }
});

postRouter.post("/add", async (req, res) => {
  const { title, body, device, no_of_comments, userID } = req.body;
  try {
    const post = new PostModal({ title, body, device, no_of_comments, userID });
    await post.save();
    res.send({ msg: "A new Post has been added", Post: post });
  } catch (err) {
    res.send({ msg: "Something is wwrong", error: err.message });
  }
});
postRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id:", id);
  const payload = req.body;
  const post = await PostModal.findOne({ _id: id });
  console.log("post:", post);
  const userID_post = post.userID;
  console.log(post.userID);
  const userID_req = req.body.userID;
  console.log(userID_req);
  try {
    if (userID_req == userID_post) {
      res.send({ msg: "You are not Authorized" });
    } else {
      await PostModal.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: " post has been updated" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", msg: err.message });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const payload = req.body;
  const post = await PostModal.findOne({ _id: id });
  const userID_post = post.userID;
  const userID_req = req.body.userID;
  try {
    if (userID_req !== userID_post) {
      res.send({ msg: "You are not Authorized" });
    } else {
      await PostModal.findByIdAndDelete({ _id: id }, payload);
      res.send({ msg: "deleted successfully" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", msg: err.message });
  }
});

module.exports = {
  postRouter,
};
