require('dotenv').config({ path: './.env' })

const API = process.env.ALCHEMY_API

const nftSdk = require('api')('@alchemy-docs/v1.0#u2rm9ol7vhuzf7')
nftSdk.server('https://eth-mainnet.g.alchemy.com/nft/v2');
const chainSdk = require('api')('@alchemy-docs/v1.0#e8ds3ul6b4ahe2')

export type Holders = string[]
export type HoldersAndBals = [{
	ownerAddress: string, tokenBalances: [{
		tokenId: string, balance: number
	}]
}]

export const _getCollectionHolders = async (
	cAddr: string, showBals?: boolean
): Promise<Holders | HoldersAndBals> => (
	(await nftSdk.getOwnersForCollection({
		contractAddress: cAddr,
		withTokenBalances: showBals,
		apikey: API
	})).ownerAddresses
)

type LastBlockResponse = {
	jsonrpc: string,
	id: number,
	result: string
}

export const _getLastBlockNumber = async (): Promise<number> =>
	chainSdk.ethBlocknumber({
		id: 1,
  		jsonrpc: '2.0',
  		method: 'eth_blockNumber',
		apikey: API
	}).then((res: LastBlockResponse) => Number(res.result))

/*
const main = async () => {
	const lastB = await _getLastBlockNumber()
	console.log(lastB)
}

main()
*/
