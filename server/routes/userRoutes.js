// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/users", userController.getAllUsers);

module.exports = router;
