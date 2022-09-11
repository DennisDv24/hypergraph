require('dotenv').config({ path: './.env' })

const ALCHEMY_API = process.env.ALCHEMY_API

const alchemySdk = require('api')('@alchemy-docs/v1.0#u2rm9ol7vhuzf7')
alchemySdk.server('https://eth-mainnet.g.alchemy.com/nft/v2');

type OnlyHolders = string[]
type HoldersAndBals = [{
	ownerAddress: string, tokenBalances: [{
		tokenId: string, balance: number
	}]
}]
type Holds = OnlyHolders | HoldersAndBals

export const _getCollectionHolders = async (
	cAddr: string, showBals?: boolean
): Promise<Holds> => (
	(await alchemySdk.getOwnersForCollection({
		contractAddress: cAddr,
		withTokenBalances: showBals,
		apikey: ALCHEMY_API
	})).ownerAddresses
)

/*
const main = async () => {
	const holds = await _getCollectionHolders(
		'0x1352149Cd78D686043B504e7e7D96C5946b0C39c', true
	)
	console.log(holds[0])

}

main()
*/
