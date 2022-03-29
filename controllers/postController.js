const { checkJwt } = require("../helper/checkJwt");
const { resFailure } = require("../helper/formatRes");
const Post = require("../models/Post");

const add_post = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
	} catch (err) {}
};

module.exports = { add_post };
