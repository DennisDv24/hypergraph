const fs = require('fs')
const ethers = require('ethers')
require('dotenv').config({ path: './.env' })



const INFURA_API = process.env.INFURA_API

const holds = JSON.parse(fs.readFileSync('holds/derivHolds.json'));

const proviederBaseURI = 'https://mainnet.infura.io/v3/'
const provider = new ethers.providers.JsonRpcProvider(
	`${proviederBaseURI}${INFURA_API}`
)

const metadataAbi = [
	'function totalSupply() external view returns (uint256)',
	'function name() external view returns (string memory)'
]

const get721Meta = addr => 
	new ethers.Contract(addr, metadataAbi, provider);

const totalSupply = async contract => 
	(await contract.totalSupply()).toNumber()

const milady_addr = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'

const logMeta = async key => {
	try {
		const colle = get721Meta(key)
		console.log([
			`Name: ${await colle.name()}`,
			`Address: ${key}`,
			`MiladyHolds: ${holds[key]}`,
			`TotalSupply: ${await totalSupply(colle)}`
		])
	} catch (e) {
		console.log('Non standarized contact, ignoring...')
	}

}

// FIXME you should get all this data from the first script
const main = async () => {
	let i = 0
	let len = Object.keys(holds).length
	for (const key of Object.keys(holds)) {
		console.log(`${(i/len) * 100}%`)
		await logMeta(key)
		i++
	}
}

main()

