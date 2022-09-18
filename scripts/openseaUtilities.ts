const axios = require('axios')
import './string.extensions'
require('dotenv').config({ path: './.env' })

const API = process.env.NFTPORT_API


type Info = {[attribute: string]: any}
const _getContractStatistics = async (contractAddress: string): Promise<Info> =>
	(await axios.get(
		`https://api.nftport.xyz/v0/transactions/stats/${contractAddress}`,
		{ headers: {Authorization: API}, params: {chain: 'ethereum'} }
	)).data.statistics

const _getContractMetadata = async (contractAddress: string): Promise<Info> =>
(await axios.get(
	`https://api.nftport.xyz/v0/nfts/${contractAddress}`,
	{headers: {Authorization: API}, params: {chain: 'ethereum', page_size: 1}}
))

const main = async () => {
	_getContractMetadata(
		'0x1352149cd78d686043b504e7e7d96c5946b0c39c'
	).then(console.log).catch(console.log)
}

main()
	

