import {
	getAllERC721HoldingsOf,
	getCollectionHolders
} from './hyperLib'

const getRelatedCollections = async (baseCollectionAddr: string): Promise<Set<string>> => {
	const holders = await getCollectionHolders(baseCollectionAddr)
	return Promise.all(holders.map(
		async holder => await getAllERC721HoldingsOf(holder)
	)).then(related => new Set(related.reduce((a, v) => a.concat(v), [])))
}

const main = async () => {
	const rels = await getRelatedCollections(
		'0x0c3b4acd61df1e193d5c53f6cd4bd27c48ff336b'
	)
	console.log(rels)
}

main()


