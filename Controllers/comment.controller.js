import prisma from "../DB/db.config.js";

export const createComment = async (req, res) => {
  const { user_id, post_id, comment } = req.body;

  try {
    //comment counter increase hanne
    await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });
    const newComment = await prisma.comment.create({
      data: {
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment,
      },
    });
    return res.status(201).json({
      newComment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the Comment" });
  }
};

export const updateComment = async (req, res) => {
  const CommentId = req.params.id;
  const { user_id, post_id,comment } = req.body;
  const updatedComment = await prisma.comment.update({
    where: {
      id: Number(CommentId),
    },
    data: {
      user_id: Number(user_id),
      post_id: Number(post_id),
      comment,
    },
  });
  return res.status(201).json({
    updatedComment,
  });
};

export const fetchComments = async (req, res) => {
  const Comments = await prisma.comment.findMany({
    include:{
      user:true,
      post:{
        include:{
          user:{
            select:{
              name:true
            }
          }
        }
      }
    }
  });
  return res.status(400).json({ Comments });
};

export const showComment = async (req, res) => {
  const id = req.params.id;
  const Comment = await prisma.comment.findFirst({
    where: {
      id: Number(id),
    },
    include:{
      post:{
        include:{
          user:true
        }
      }
    }
  });
  return res.status(200).json({ Comment });
};

export const deleteComment = async (req, res) => {
  const id = req.params.id;
  await prisma.comment.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({ msg: "Comment deleted Sucessfully" });
};
