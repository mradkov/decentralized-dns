module.exports = (event) => {
	return new Promise((resolve, reject) => {
		event.watch((err, res) => {
			if (err) {
				reject(err);
			}
			resolve(res);
		})
	});
}