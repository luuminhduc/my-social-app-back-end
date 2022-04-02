const {
	ref,
	uploadBytesResumable,
	getDownloadURL,
} = require("firebase/storage");
const { checkJwt } = require("../helper/checkJwt");
const { resSuccess, resFailure } = require("../helper/formatRes");
const User = require("../models/User");
const storage = require("../db/firebase");

global.XMLHttpRequest = require("xhr2");

const get_user_info = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");

	try {
		const { id } = req.params;
		const user = await User.findById(id);
		resSuccess(res, 200, { user });
	} catch (err) {
		resFailure(res, 400, err.message);
	}
};

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
				$set: { "following_list.$.accepted": true },
			},
			{ new: true }
		);
		const user = await User.findOneAndUpdate(
			{
				id: u_id,
				"follower_list.u_id": target_id,
			},
			{
				$set: { "follower_list.$.accepted": true },
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

const update_user_info = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");

	const { file } = req;

	if (file) {
		uploadAvatar(file).then((url) => {
			updateInfo(u_id, { ...req.body, avatar: url }, res);
		});
	} else {
		updateInfo(u_id, req.body, res);
	}
};

const updateInfo = async (id, data, res) => {
	const { avatar, username, phone_number, about, gender, birthday, hobbies } =
		data;

	try {
		const user = await User.findByIdAndUpdate(
			id,
			{
				username: username ? username : this.username,
				avatar: avatar ? avatar : this.avatar,
				phone_number: phone_number ? phone_number : this.phone_number,
				about: about ? about : this.about,
				gender: gender ? gender : this.gender,
				birthday: birthday ? birthday : this.birthday,
				hobbies: hobbies ? hobbies : this.hobbies,
			},
			{ new: true }
		);
		resSuccess(res, 200, { user });
	} catch (err) {
		console.log(err);
		resFailure(res, 400, err.message);
	}
};

const uploadAvatar = (file) => {
	return new Promise((resolve, reject) => {
		const time = new Date().toISOString();
		const filename = file.originalname + time;

		const storageRef = ref(storage, `/avatars/${filename}`);

		const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
			contentType: "image/jpeg",
		});

		uploadTask.on(
			"state_changed",
			() => {},
			(err) => {
				console.log(err);
				reject(err);
			},
			async () => {
				const url = await getDownloadURL(uploadTask.snapshot.ref);
				resolve(url);
			}
		);
	});
};

module.exports = {
	follow_target,
	accept_follow,
	update_user_info,
	get_user_info,
};
