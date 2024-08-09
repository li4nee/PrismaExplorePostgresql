import { query } from "express";
import prisma from "../DB/db.config.js";

export const createPost = async (req, res) => {
  const { user_id, title, description } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title,
        description,
      },
    });
    return res.status(201).json({
      newPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Post" });
  }
};

export const updatePost = async (req, res) => {
  const PostId = req.params.id;
  const { user_id, title, description } = req.body;
  const updatedPost = await prisma.post.update({
    where: {
      id: Number(PostId),
    },
    data: {
      user_id: Number(user_id),
      title,
      description,
    },
  });
  return res.status(201).json({
    updatedPost,
  });
};

export const fetchPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const skip = (page - 1) * limit;
  try {
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      where: {
        OR: [
          {
            title: {
              startsWith: "babu",
            },
          },
          {
            title: {
              endsWith: "ram",
            },
          },
        ],
      },
    });
    // to get total post count
    const totalPost = await prisma.post.count();
    const totalPages = Math.ceil(totalPost / limit);
    return res.status(200).json({
      posts,
      meta: {
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching posts" });
  }
};

export const showPost = async (req, res) => {
  const id = req.params.id;
  const Post = await prisma.post.findFirst({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({ Post });
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({ msg: "Post deleted Sucessfully" });
};

export const searchPost = async (req, res) => {
  const query = req.query.q;
  const post = await prisma.post.findMany({
    where: {
      description: {
        search: query,
      },
    },
  });
  return res.status(200).json({ post });
};
