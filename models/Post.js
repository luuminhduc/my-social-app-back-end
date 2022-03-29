const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	photos: {
		type: [String],
		required: true,
		min: 1,
	},
	u_id: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	created_at: {
		type: Date,
		default: new Date(),
	},
	likes: {
		type: [mongoose.Types.ObjectId],
		default: [],
	},
	isBaned: {
		type: Boolean,
		default: false,
	},
	topic: {
		type: [String],
		default: [],
	},
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
