const mongoose = require("mongoose");

const JwtSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	u_id: {
		type: String,
		required: true,
	},
	created_at: {
		type: Date,
		default: new Date(),
	},
});

const Jwt = mongoose.model("jwt", JwtSchema);

module.exports = Jwt;
