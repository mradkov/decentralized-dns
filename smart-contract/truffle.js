module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "42"
		},
		coverage: {
			host: "127.0.0.1",
			network_id: "*",
			port: 8555,
			gas: 0xfffffffffff,
			gasPrice: 0x01
		}
	}
};