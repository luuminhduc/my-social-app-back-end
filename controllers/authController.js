const { resFailure, resSuccess } = require("../helper/formatRes");
const User = require("../models/User");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");
const Jwt = require("../models/JWT");
const { checkJwt } = require("../helper/checkJwt");

const tokeAge = 365 * 24 * 60 * 60;

const createToken = (id) => {
	return jwt.sign({ id }, process.env.jwtToken, {
		expiresIn: tokeAge,
	});
};

const createResetToken = (id) => {
	return jwt.sign({ id }, process.env.resetToken, {
		expiresIn: 24 * 60 * 60,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return resFailure(res, 400, "Missing fields");
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		await Jwt.create({ u_id: user._id, token });
		resSuccess(res, 200, { token });
	} catch (err) {
		resFailure(res, 400, err.message);
	}
};

const register = async (req, res) => {
	const { email, password, username, password_confirm } = req.body;
	if (!email || !password || !username || !password_confirm)
		return resFailure(res, 400, "Missing fields");
	if (!isEmail(email)) return resFailure(res, 400, "Invalid email");
	if (password !== password_confirm)
		return resFailure(
			res,
			400,
			"Password and confirm password must be the same"
		);
	try {
		const user = await User.create({ email, password, username });
		const token = createToken(user._id);
		await Jwt.create({ u_id: user._id, token });
		resSuccess(res, 200, { token });
	} catch (err) {
		if (err.code === 11000)
			return resFailure(res, 400, "This email already exists in our database");
		console.log(err);
	}
};

const logout = async (req, res) => {
	const uid = await checkJwt(req);
	if (!uid) return resFailure(res, 422, "Unauthenticated");
	const token = req?.headers?.authorization?.split(" ")[1];
	try {
		await Jwt.findOneAndDelete({ token });
		await resSuccess(res, 200, {});
	} catch (err) {
		resFailure(res, 400, "Internal server error");
	}
};

const get_auth_info = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");

	try {
		const user = await User.findById(u_id);
		resSuccess(res, 200, { user });
	} catch (err) {
		resFailure(res, 400, err.message);
	}
};

module.exports = { login, register, logout, get_auth_info };
