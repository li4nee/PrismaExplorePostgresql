import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/user.routes.js";
import postRouter from "./Routes/post.route.js";
import commentRouter from "./Routes/comment.route.js";
dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, (ERR) => {
  if (!ERR) {
    console.log("Server running on port :", PORT);
  }
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.get("/test", (req, res) => {
  return res.send("ok");
});
