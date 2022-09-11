const { 
	_getCollectionHolders
} = require('./alchemyUtilities.js')

/** @function
 * @returns {address:string[]}
 */
const getCollectionHolders = async contractAddr =>
	await _getCollectionHolders(contractAddr)

/**
 * @returns {Object.<address:string, balanceHolding:int>}
 */
const getHoldersBalancesForCollection = async contractAddr => {
	const holds = await _getCollectionHolders(contractAddr, withTokenBalances = 'true')
	return holds.reduce((a, v) => ({...a, [v.ownerAddress]: v.tokenBalances.length}))
}

const main = async () => {
	const holds = await getHoldersBalancesForCollection(
		'0x1352149Cd78D686043B504e7e7D96C5946b0C39c'
	)
	console.log(holds)
}

main()
