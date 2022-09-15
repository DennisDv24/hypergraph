import {
	_getCollectionHolders,
	HoldersAndBals,
	Holders
} from './alchemyUtilities'
import {
	_getERC721TransactionsOf
} from './etherscanUtilities'


type AddressBals = {[addr: string]: number}
const _clearNullBals = (bals: AddressBals): AddressBals => {
	const copy = bals		
	for (const key of Object.keys(copy))
		if(copy[key] === 0) delete copy[key]
	return copy
}


export const getCollectionHolders = async (contractAddr: string): Promise<Holders> =>
	await _getCollectionHolders(contractAddr) as Holders

type FormatedHolds = {[addr: string]: number}
export const getHoldersBalancesFor = async (cAddr: string): Promise<FormatedHolds> => {
	const holds = await _getCollectionHolders(cAddr, true) as HoldersAndBals
	return holds.reduce((a, v) => (
		{...a, [v.ownerAddress]: v.tokenBalances.length}
	), {})
}

export const getAllERC721HoldingsAndBalsOf = async (addr: string): Promise<FormatedHolds> => {
	addr = addr.toLowerCase()
	const txs = await _getERC721TransactionsOf(addr)
	let bals: FormatedHolds = {}
	try {
		txs.forEach(tx => {
			const colle = tx.contractAddress
			if (!(colle in bals)) bals[colle] = 0
			if (tx.to === addr) bals[colle]++
			else bals[colle] --
		})
		bals = _clearNullBals(bals)
	} catch (e) {
		console.log(
			`ERROR: Something happened while computing holdings of ${addr}`
		)
	}
	return bals
}

export const getAllERC721HoldingsOf = async (addr: string): Promise<string[]> =>
	Object.keys(await getAllERC721HoldingsAndBalsOf(addr))
	


const main = async () => {
	const addr = '0x0E124A7c9b378d7276590b6b8b676a75ff923a03'
	const holds = await getAllERC721HoldingsOf(addr)
	console.log(holds)
}

main()

