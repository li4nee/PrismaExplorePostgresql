import prisma from "../DB/db.config.js";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return res.status(400).json({ error: "Email already taken" });
    }
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the User" });
  }
};

export const updateUser = async (req, res) => {
  const UserId = req.params.id;
  const { name, email, password } = req.body;
  const updatedUser = await prisma.user.update({
    where: {
      id: Number(UserId),
    },
    data: {
      name,
      email,
      password,
    },
  });
  return res.status(201).json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    created_at: updatedUser.created_at,
  });
};

export const fetchUsers = async (req, res) => {
  const Users = await prisma.user.findMany({
    // include: {
    //   post: {
    //     select: {
    //       title: true,
    //       comment_count: true,
    //     },
    //   },
    // },
    select: {
      id:true,
      _count: {
        select: {
          post: true,
        },
      },
    },
  });
  return res.status(400).json({ Users });
};

export const showUser = async (req, res) => {
  const id = req.params.id;
  const User = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({ User });
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  return res.status(200).json({ msg: "User deleted Sucessfully" });
};
