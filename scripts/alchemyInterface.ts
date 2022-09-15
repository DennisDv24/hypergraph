import {
	_getCollectionHolders,
	HoldersAndBals,
	Holders
} from './alchemyUtilities'

const getCollectionHolders = async (contractAddr: string): Promise<Holders> =>
	await _getCollectionHolders(contractAddr) as Holders

type FormatedHolds = {[addr: string]: number}
const getHoldersBalancesFor = async (cAddr: string): Promise<FormatedHolds> => {
	const holds = await _getCollectionHolders(cAddr, true) as HoldersAndBals
	return holds.reduce((a, v) => (
		{...a, [v.ownerAddress]: v.tokenBalances.length}
	), {})
}

const main = async () => {
	const addr = '0x1352149Cd78D686043B504e7e7D96C5946b0C39c'
	const bals = await getHoldersBalancesFor(addr)
	const holds = await getCollectionHolders(addr)
	console.log(holds)
}

main()

module.exports = {
	getCollectionHolders,
	getHoldersBalancesFor
}
