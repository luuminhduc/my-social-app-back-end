const { checkJwt } = require("../helper/checkJwt");
const { resFailure, resSuccess } = require("../helper/formatRes");
const Post = require("../models/Post");

const storage = require("../db/firebase");
const {
	ref,
	uploadBytesResumable,
	getDownloadURL,
} = require("firebase/storage");

global.XMLHttpRequest = require("xhr2");

const add_post = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");

	const { title } = req.body;
	const { files } = req;

	if (!title) return resFailure(res, 400, "Title is required");
	if (files?.length < 1) return resFailure(res, 400, "Photo is required");
	if (files.length > 10) return resFailure(res, 400, "Maximum photos is 10");

	const photos = [];

	const uploadFile = (file) => {
		return new Promise((resolve, reject) => {
			const time = new Date().toISOString();

			const filename = file.originalname + time;

			const storageRef = ref(storage, `/posts/${filename}`);

			const uploadTask = uploadBytesResumable(storageRef, file.buffer, {
				contentType: "image/jpeg",
			});
			uploadTask.on(
				"state_changed",
				() => {},
				(err) => console.log(err),
				async () => {
					const url = await getDownloadURL(uploadTask.snapshot.ref);
					photos.push(url);
					resolve(url);
				}
			);
		});
	};

	Promise.all(
		files.map(async (file) => {
			await uploadFile(file);
		})
	)
		.then(() => {
			const post = { u_id, title, photos };
			savePostToDb(res, post);
		})
		.catch((err) => {
			console.log(err);
		});
};

const like_post = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
		const { id } = req.params;
		const post = await Post.findByIdAndUpdate(
			id,
			{
				$addToSet: { likes: u_id },
			},
			{ new: true }
		);
		resSuccess(res, 200, { post });
	} catch (err) {
		console.log(err);
	}
};

const remove_like_post = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
		const { id } = req.params;
		const post = await Post.findByIdAndUpdate(
			id,
			{
				$pull: { likes: u_id },
			},
			{ new: true }
		);
		resSuccess(res, 200, { post });
	} catch (err) {
		console.log(err);
	}
};

const delete_post = async (req, res) => {
	const u_id = await checkJwt(req);
	if (!u_id) return resFailure(res, 422, "Unauthenticated");
	try {
		const { id } = req.params;
		const post = await Post.findById(id);
		if (!post) return resFailure(res, 400, "Post does not exist");
		if (post.u_id.toString() !== u_id)
			return resFailure(res, 400, "Not allowed");
		await Post.findByIdAndDelete(id);
		resSuccess(res, 200, {});
	} catch (err) {
		console.log(err);
	}
};

const savePostToDb = async (res, data) => {
	try {
		const post = await Post.create(data);
		resSuccess(res, 200, { post });
	} catch (err) {
		console.log(err);
	}
};

module.exports = { add_post, like_post, remove_like_post, delete_post };
