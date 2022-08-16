const ethers = require('ethers')
require('dotenv').config({ path: './.env' });

const addr = '0x0E124A7c9b378d7276590b6b8b676a75ff923a03'

const get721Holds = async (addr) => {
	const provider = new ethers.providers.EtherscanProvider(
		'mainnet',
		process.env.ETHERSCAN_API
	)
	const history = await provider.getHistory(addr)
	console.log(history)
}

get721Holds(addr)
