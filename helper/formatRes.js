const resSuccess = (res, status, data) => {
	return res.status(status).json({
		success: true,
		error: null,
		data,
	});
};

const resFailure = (res, status, error) => {
	return res.status(status).json({
		success: false,
		data: null,
		error,
	});
};

module.exports = { resSuccess, resFailure };
