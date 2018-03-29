module.exports = (seconds) => {
	const id = Date.now();

	return new Promise((resolve, reject) => {
		web3.currentProvider.sendAsync({
			jsonrpc: '2.0',
			method: 'evm_increaseTime',
			params: [seconds],
			id: id,
		}, err1 => {
			if (err1) return reject(err1);

			web3.currentProvider.sendAsync({
				jsonrpc: '2.0',
				method: 'evm_mine',
				id: id + 1,
			}, (err2, res) => {
				return err2 ? reject(err2) : resolve(res);
			});
		});
	});
}