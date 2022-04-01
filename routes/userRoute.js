const { Route } = require("express");
const express = require("express");
const {
	follow_target,
	accept_follow,
} = require("../controllers/userController");

const route = express();

route.put(`/follow-target/:id`, follow_target);
route.put("/accept/:id", accept_follow);

module.exports = route;
