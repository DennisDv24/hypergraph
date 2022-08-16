const ethers = require('ethers')
const axios = require('axios')
require('dotenv').config({ path: './.env' })

const addr = '0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
const milady_addr = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'

const ETHERSCAN_API = process.env.ETHERSCAN_API
const COVALENT_API = process.env.COVALENT_API

const getEtherscanProvider = () => 
	new ethers.providers.EtherscanProvider('mainnet', ETHERSCAN_API)

const get721Txs = async addr => {
	const currentBlock = await getEtherscanProvider().getBlockNumber()
	const txs = await axios.get(`\
		https://api.etherscan.io/api\
		?module=account\
		&action=tokennfttx\
		&address=${addr}\
		&startblock=0\
		&endblock=${currentBlock}\
		&apikey=${ETHERSCAN_API}\
	`.replace(/\t/g, ''))
	return txs.data.result
}

const get721HoldsFromTxs = addr => async txs => {
	addr = addr.toLowerCase()
	const tokensHeld = {}
	txs.forEach(tx => {
		const colle = tx.contractAddress
		if(!(colle in tokensHeld)) tokensHeld[colle] = 0
		if(tx.to === addr) tokensHeld[colle]++
		else tokensHeld[colle]--
	})
	return tokensHeld
}


const getCollectionsHeldByAddress = async (addr) => 
	get721Txs(addr).then(get721HoldsFromTxs(addr))

const getCollectionStatsByName = async name =>
	await axios.get(
		`https://api.opensea.io/api/v1/collection/${name}/stats`
	)

// FIXME I need a Opensea api key
const getCollectionName = async contractAddr => 
	(await axios.get(
		`https://api.opensea.io/api/v1/asset_contract/${contractAddr}`
	)).data.collection.slug

// FIXME I need a Opensea api key
const getCollectionHoldersCount = async contractAddr =>
	getCollectionName(contractAddr).then(getCollectionStatsByName).then(
		res => res.data.stats.num_owners
	)

const getHoldersOfCollection = async contractAddr =>
	(await axios.get(`\
		https://api.covalenthq.com/v1/1/tokens/\
		${contractAddr}\
		/token_holders/?key=${COVALENT_API}\
		&page-size=${await getCollectionHoldersCount(contractAddr)}\
	`.replace(/\t/g, ''))).data.data


//get721Holds(addr).then(console.log)
getHoldersOfCollection(milady_addr).then(console.log)
//getCollection(milady_addr).then(console.log)


