const fs = require('fs')
const ethers = require('ethers')
const axios = require('axios')
require('dotenv').config({ path: './.env' })

const addr = '0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
const milady_addr = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'

const ETHERSCAN_API = process.env.ETHERSCAN_API
const COVALENT_API = process.env.COVALENT_API
const OPENSEA_API = process.env.OPENSEA_API


Object.defineProperty(String.prototype, "formatTabs", {
	value: function formatTabs() {
        return this.replace(/\t/g, '')
    },
    writable: true,
    configurable: true,
})


const getEtherscanProvider = () => 
	new ethers.providers.EtherscanProvider('mainnet', ETHERSCAN_API)

// FIXME TODO is the output paginated?
const get721Txs = async addr => {
	const currentBlock = await getEtherscanProvider().getBlockNumber()
	const txs = await axios.get(`\
		https://api.etherscan.io/api\
		?module=account\
		&action=tokennfttx\
		&address=${addr}\
		&startblock=${13090000}\
		&endblock=${currentBlock}\
		&apikey=${ETHERSCAN_API}\
	`.formatTabs())
	return txs.data.result
}

const get721HoldsFromTxs = addr => async txs => {
	addr = addr.toLowerCase()
	const tokensHeld = {}
	try {
		txs.forEach(tx => {
			const colle = tx.contractAddress
			if(!(colle in tokensHeld)) tokensHeld[colle] = 0
			if(tx.to === addr) tokensHeld[colle]++
			else tokensHeld[colle]--
		})
		for (const key of Object.keys(tokensHeld))
			if(tokensHeld[key] === 0) delete tokensHeld[key]
	} catch (e) {
		console.log('Got a addr that is not holding anything rn!')
	}
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
		`https://api.opensea.io/api/v1/asset_contract/${contractAddr}`,
		{ headers: { 'x-api-key': OPENSEA_API } }
	)).data.collection.slug

const getCollectionHoldersCount = async contractAddr =>
	getCollectionName(contractAddr).then(getCollectionStatsByName).then(
		res => res.data.stats.num_owners
	)

const getHoldersOfCollection = async (contractAddr, amount = null) =>
	(await axios.get(`\
		https://api.covalenthq.com/v1/1/tokens/\
		${contractAddr}\
		/token_holders/?key=${COVALENT_API}\
		&page-size=${
			amount ? amount : await getCollectionHoldersCount(contractAddr)
		}\
	`.formatTabs())).data.data.items.map(
		({ address, balance }) => ({ address, balance })
	)


const getMiladyHoldsAndDerivs = async (amount = null) => {
	const derivedHolds = {}
	console.log('Fetching Milady holders...')
	const miladyHolders = await getHoldersOfCollection(milady_addr, amount)
	let i = 0
	const len = miladyHolders.length
	for (const holder of miladyHolders) {
		const percent = (i/len)*100
		console.log(`Computing holders derived holds: ${percent}%`)
		if(Math.floor(percent * 10) % 10 === 0 && percent > 1) {
			console.log(`Taking snapshot at ${Math.floor(percent)}%...`)
			fs.writeFile(
				`derivHoldsSnapshot${Math.floor(percent)}.json`,
				JSON.stringify(derivedHolds),
				err => {if(err) throw err}
			)
		}

		const thisHelds = await getCollectionsHeldByAddress(holder.address)
		Object.keys(thisHelds).forEach(async colle => {
			if(!(colle in derivedHolds)) 
				derivedHolds[colle] = thisHelds[colle]
			else
				derivedHolds[colle] += thisHelds[colle]
		})
		i++
	}
	return derivedHolds
}

const main = async () => {
	const derivHoldsTop10 = await getMiladyHoldsAndDerivs()
	fs.writeFile(
		'derivHolds.json',
		JSON.stringify(derivHoldsTop10),
		err => {if(err) throw err}
	)
}

main()

