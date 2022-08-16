const ethers = require('ethers')
const axios = require('axios')
require('dotenv').config({ path: './.env' });

const addr = '0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
const API = process.env.ETHERSCAN_API

const getEtherscanProvider = () => 
	new ethers.providers.EtherscanProvider('mainnet', API);

const get721Txs = async (addr) => {
	const currentBlock = await getEtherscanProvider().getBlockNumber();
	const txs = await axios.get(`\
		https://api.etherscan.io/api\
		?module=account\
		&action=tokennfttx\
		&address=${addr}\
		&startblock=0\
		&endblock=${currentBlock}\
		&apikey=${API}\
	`.replace(/\t/g, ''))
	return txs.data.result
}

const get721HoldsFromTxs = addr => async txs => {
	addr = addr.toLowerCase()
	const tokensHeld = {}
	txs.forEach(tx => {
		const colle = tx.contractAddress;
		if(!(colle in tokensHeld))
			tokensHeld[colle] = 0
		if(tx.to === addr)
			tokensHeld[colle]++
		else
			tokensHeld[colle]--
	})
	return tokensHeld
}

const get721Holds = async (addr) => 
	get721Txs(addr).then(get721HoldsFromTxs(addr))


get721Holds(addr).then(console.log)

//get721HoldsFromTxs(addr, await get721Txs(addr)).then(console.log);


