require('dotenv').config({ path: './.env' })

const ALCHEMY_API = process.env.ALCHEMY_API

const alchemySdk = require('api')('@alchemy-docs/v1.0#u2rm9ol7vhuzf7')
alchemySdk.server('https://eth-mainnet.g.alchemy.com/nft/v2');

const _getCollectionHolders = async (contractAddr, withTokenBalances) => (
	(await alchemySdk.getOwnersForCollection({
		contractAddress: contractAddr,
		withTokenBalances: withTokenBalances,
		apikey: ALCHEMY_API
	})).ownerAddresses
)


module.exports = {
	_getCollectionHolders	
}
