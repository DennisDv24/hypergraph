import {
	_getLastBlockNumber
} from './alchemyUtilities'
import './string.extensions'
const axios = require('axios')

require('dotenv').config({ path: './.env' })

const API = process.env.ETHERSCAN_API
// TODO
// Computed as a module constant for efficiency reasons
// const LAST_BLOCK = await _getLastBlockNumber()

type TxDataResponse = {
	contractAddress: string,
	to: string,
	from: string,
}

export const _getERC721TransactionsOf = async (addr: string): Promise<TxDataResponse[]> =>
	(await axios.get(`\
		https://api.etherscan.io/api\
		?module=account\
		&action=tokennfttx\
		&address=${addr}\
		&startblock=${13090000}\
		&endblock=${await _getLastBlockNumber()}\
		&apikey=${API}\
	`.formatTabs())).data.result

/*
const main = async () => {
	const txs = await _getERC721TransactionsOf(
		'0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
	)
	console.log(txs.map(tx => tx as TxDataResponse))
}

main()
*/
