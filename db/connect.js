const mongoose = require("mongoose");

const connect = async () => {
	try {
		await mongoose.connect(process.env.db_key);
	} catch (err) {
		console.log(err);
	}
};

module.exports = connect;
