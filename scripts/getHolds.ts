import {
	getAllERC721HoldingsOf,
	getCollectionHolders
} from './hyperLib'
const fs = require('fs')

const updateRelatedCollections = async (
	rels: Set<string>, holder: string, holders: string[]
): Promise<Set<string>> => {
	console.log(`${holders.lastIndexOf(holder)/holders.length * 100}%`);
	return new Set([...Array.from(rels), ...await getAllERC721HoldingsOf(holder)])
}

const getRelatedCollections = async (ofCollectionAddr: string): Promise<Set<string>> => {
	const holders = await getCollectionHolders(ofCollectionAddr)
	let relHolds = new Set<string>()
	for (const holder of holders)
		relHolds = await updateRelatedCollections(relHolds, holder, holders)
	return relHolds
}

const saveRelatedCollections = async (collections: Set<string>) => {
	fs.writeFile(
		'../data/derivHolds.json',
		JSON.stringify(Array.from(collections)),
		(err: any) => {if (err) throw err}
	)
}

const main = async () => {
	const rels = await getRelatedCollections(
		'0x5af0d9827e0c53e4799bb226655a1de152a425a5'
	)
	saveRelatedCollections(rels)
	console.log(rels)
}

main()


