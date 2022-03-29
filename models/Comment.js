const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
	u_id: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	post_id: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	likes: {
		type: [mongoose.Types.ObjectId],
		default: [],
	},
	reply_to: {
		type: mongoose.Types.ObjectId,
		default: "",
	},
	created_at: {
		type: Date,
		default: new Date(),
	},
});

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
