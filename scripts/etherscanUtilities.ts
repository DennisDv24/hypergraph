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

const get721Txs = async (addr: string): Promise<string[]> =>
	(await axios.get(`\
		https://api.etherscan.io/api\
		?module=account\
		&action=tokennfttx\
		&address=${addr}\
		&startblock=${13090000}\
		&endblock=${await _getLastBlockNumber()}\
		&apikey=${API}\
	`.formatTabs()))


const main = async () => {
	const txs = await get721Txs(
		'0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
	)
	console.log(txs)
	console.log(`\
		hola que tal\
		andamos\
	`.formatTabs())

}

main()
