const userService = require("../services/user.service");
const { hashPassword } = require("../utils/hashPassword");

const getAllUsers = async (req, res) => {
  try {
    const results = await userService.getAllUsers();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createUser = async (req, res) => {
  const { username, password, email, fullname } = req.body;
  const hashedPassword = hashPassword(password);
  try {
    const user = await userService.createUser({
      username,
      hashedPassword,
      email,
      fullname,
    });
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (+id == req.user.id || req.user.roles.includes("admin")) {
    try {
      const user = await userService.getUserById(id);
      user.password = undefined;
      user.google_id = undefined;
      user.cart_id = undefined;
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json("User not found");
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
};
const getUserProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await userService.getUserById(id);
    user.password = undefined;
    user.google_id = undefined;
    user.cart_id = undefined;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const { username, email, fullname } = req.body;
  if (+req.params.id == req.user.id || req.user.roles.includes("admin")) {
    try {
      const results = await userService.updateUser({
        username,
        email,
        fullname,
        id: req.user.id,
      });
      return res.status(201).json(results);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  res.status(401).json({ message: "Unauthorized" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (+id == req.user.id || req.user.roles.includes("admin")) {
    try {
      const results = await userService.deleteUser(id);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
};
