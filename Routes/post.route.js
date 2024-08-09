import { Router } from "express";
import {
  createPost,
  deletePost,
  fetchPosts,
  searchPost,
  showPost,
  updatePost,
} from "../Controllers/post.controller.js";

const router = Router();

router.post("/", createPost);
router.get("/search", searchPost);
router.put("/:id", updatePost);
router.get("/", fetchPosts);
router.get("/:id", showPost);
router.delete("/:id", deletePost);

export default router;
