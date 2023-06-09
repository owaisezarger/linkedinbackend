const express = require("express");
const { connection } = require("./db");
const { postRouter } = require("./routes/Posts.route");
require("dotenv").config();
const { userRouter } = require("./routes/Users.route");
const { authenticate } = require("./middlewares/Auth.middleware");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);
app.listen(process.env.Port, async () => {
  try {
    await connection;
    console.log({ msg: "Connected to DB" });
  } catch (err) {
    console.log({ MSG: err.message });
  }

  console.log({ msg: `Server is Running on ${process.env.Port}` });
});
//backend works properly in local environment, when deployed unable to load data due to some ip address error"
