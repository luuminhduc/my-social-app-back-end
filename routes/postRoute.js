const express = require("express");
const {
	add_post,
	like_post,
	remove_like_post,
	delete_post,
	get_posts,
	get_posts_of_user,
} = require("../controllers/postController");
const upload = require("../helper/initMulter");

const route = express.Router();

route.post("/posts", upload.array("photos"), add_post);
route.put("/posts/like/:id", like_post);
route.put("/posts/remove-like/:id", remove_like_post);
route.delete("/posts/:id", delete_post);
route.get("/posts", get_posts);
route.get("/users-posts/:id", get_posts_of_user);

module.exports = route;
