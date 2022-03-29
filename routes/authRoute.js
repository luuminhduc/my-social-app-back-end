const express = require("express");
const { login, register, logout } = require("../controllers/authController");
const route = express.Router();

route.post("/login", login);

route.post("/register", register);

route.post("/logout", logout);

module.exports = route;
