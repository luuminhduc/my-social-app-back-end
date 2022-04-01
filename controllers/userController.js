const { checkJwt } = require("../helper/checkJwt");
const { resSuccess, resFailure } = require("../helper/formatRes");
const User = require("../models/User");

const follow_target = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
		const { id: target_id } = req.params;
		const current_target = await User.findById(target_id);
		const { follower_list } = current_target;
		if (follower_list.map((el) => el.u_id).includes(u_id))
			return resFailure(res, 400, "Invalid method");
		const target = await User.findByIdAndUpdate(
			target_id,
			{
				$addToSet: {
					follower_list: { u_id, accepted: this.is_private ? false : true },
				},
				// $pull: {
				// 	follower_list: { accepted: true },
				// },
			},
			{ new: true }
		);
		const user = await User.findByIdAndUpdate(
			u_id,
			{
				$addToSet: {
					following_list: {
						u_id: target_id,
						accepted: target.is_private ? false : true,
					},
				},
				// $pull: {
				// 	following_list: { accepted: true },
				// },
			},
			{ new: true }
		);
		resSuccess(res, 200, { user, target });
	} catch (err) {}
};

const accept_follow = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
		const { id: target_id } = req.params;
		const target = await User.findOneAndUpdate(
			{
				id: target_id,
				"following_list.u_id": u_id,
			},
			{
				$set: { "following_list.$.accepted": false },
			},
			{ new: true }
		);
		const user = await User.findOneAndUpdate(
			{
				id: u_id,
				"follower_list.u_id": target_id,
			},
			{
				$set: { "follower_list.$.accepted": false },
			},
			{ new: true }
		);
		resSuccess(res, 200, {
			user,
			target,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = { follow_target, accept_follow };
