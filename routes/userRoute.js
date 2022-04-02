const express = require("express");
const {
	follow_target,
	accept_follow,
	update_user_info,
	get_user_info,
} = require("../controllers/userController");
const upload = require("../helper/initMulter");

const route = express.Router();

route.get("/users/:id", get_user_info);
route.put(`/follow-target/:id`, follow_target);
route.put("/accept/:id", accept_follow);
route.put("/user-info", upload.single("avatar"), update_user_info);

module.exports = route;
