const jwt = require("jsonwebtoken");
const Jwt = require("../models/JWT");

const checkJwt = async (req) => {
	let id = "";
	const token = req?.headers?.authorization?.split(" ")[1];
	if (token) {
		const exist = await Jwt.findOne({ token });
		if (exist) {
			await jwt.verify(token, process.env.jwtToken, async (err, code) => {
				if (!err) id = code.id;
			});
		}
	}
	return id;
};

module.exports = { checkJwt };
