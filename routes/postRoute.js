const express = require("express");
const {
	add_post,
	like_post,
	remove_like_post,
	delete_post,
} = require("../controllers/postController");
const upload = require("../helper/initMulter");

const route = express.Router();

route.post("/posts", upload.array("photos"), add_post);
route.put("/posts/like/:id", like_post);
route.put("/posts/remove-like/:id", remove_like_post);
route.delete("/posts/:id", delete_post);

module.exports = route;
