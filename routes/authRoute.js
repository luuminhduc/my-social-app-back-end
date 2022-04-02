const express = require("express");
const {
	login,
	register,
	logout,
	get_auth_info,
} = require("../controllers/authController");
const route = express.Router();

route.post("/login", login);

route.post("/register", register);

route.post("/logout", logout);

route.get("/auth-info", get_auth_info);

module.exports = route;
