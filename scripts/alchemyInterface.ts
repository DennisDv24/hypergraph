import {_getCollectionHolders} from './alchemyUtilities'

const getCollectionHolders = async (contractAddr: string): Promise<string[]> =>
	await _getCollectionHolders(contractAddr, false)

type Holdings = {[addr: string]: number}

const getHoldersBalancesForCollection = async (cAddr: string): Promise<Holdings> => {
	const holds = await _getCollectionHolders(cAddr, true)
	return holds.reduce((a:any, v:any) => (
		{...a, [v.ownerAddress]: v.tokenBalances.length}
	))
}

const main = async () => {
	const holds = await getCollectionHolders(
		'0x1352149Cd78D686043B504e7e7D96C5946b0C39c'
	)
	console.log(holds)
}

main()
