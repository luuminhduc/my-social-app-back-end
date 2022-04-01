const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const followSchema = new mongoose.Schema({
	u_id: {
		type: String,
		required: true,
	},
	accepted: {
		type: Boolean,
		default: true,
	},
});

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		max: 20,
	},
	email: {
		type: String,
		validate: isEmail,
		unique: true,
		required: true,
	},
	avatar: {
		type: String,
		default: "",
	},
	phone_number: {
		type: String,
		default: "",
	},
	about: {
		type: String,
		default: "",
	},
	gender: {
		type: String,
		default: "",
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 20,
	},
	following_list: {
		type: Array,
		default: [],
	},
	follower_list: {
		type: Array,
		default: [],
	},
	is_active: {
		type: Boolean,
		default: true,
	},
	is_checked: {
		type: Boolean,
		default: false,
	},
	is_private: {
		type: Boolean,
		default: false,
	},

	created_at: {
		type: Date,
		default: new Date(),
	},
});

UserSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) return user;
		throw Error("Incorrect password");
	}
	throw Error("User does not exist");
};

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
