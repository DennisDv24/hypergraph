import {
	getCollectionHolders
} from './hyperLib'
const fs = require('fs')

const normalizeToPercent = (n: number): number => n < 0 || n > 1 ? 0 : n

/* Relation basic model */
const computeMatchPercent = async (
	baseCollectionHolders: string[], childCollectionAddr: string
): Promise<number> => {
	const derivHolds = new Set(await getCollectionHolders(childCollectionAddr))
	const intersection = baseCollectionHolders.filter(
		holder => derivHolds.has(holder)
	)
	return normalizeToPercent(intersection.length / baseCollectionHolders.length)
}

type RelatedCollectionsWithIndex = {
	contractAddress: string,
	matchPercent: number
}[]

const updateRelationIndeces = async (
	currentRelations: RelatedCollectionsWithIndex,
	baseCollectionHolders: string[],
	childCollectionAddr: string,
	relatedCollectionsAddrs: string[]
): Promise<RelatedCollectionsWithIndex> => {
	console.log(`${currentRelations.length/relatedCollectionsAddrs.length * 100}%`)
	return [...currentRelations, {
		contractAddress: childCollectionAddr,
		matchPercent: await computeMatchPercent(baseCollectionHolders, childCollectionAddr)
	}] as RelatedCollectionsWithIndex
}

const computeRelationIndexesOfCollections = async (
	baseCollection: string, relatedCollections: string[]
): Promise<RelatedCollectionsWithIndex> => {
	const baseHolders = await getCollectionHolders(baseCollection)
	let rels: RelatedCollectionsWithIndex = []
	for (const collection of relatedCollections)
		rels = await updateRelationIndeces(rels, baseHolders, collection, relatedCollections)
	return rels
}

const saveRelatedCollectionsAndIndices = async (
	collections: RelatedCollectionsWithIndex
) => {
	fs.writeFile(
		'../data/sortedByRelationIndex.json',
		JSON.stringify(collections),
		(err: any) => {if (err) throw err}
	)
}

const main = async () => {
	const BASE_COLLECTION = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'
	const RELATED_COLLECTIONS = JSON.parse(fs.readFileSync('../data/derivHolds.json'))

	const relations = await computeRelationIndexesOfCollections(
		BASE_COLLECTION, RELATED_COLLECTIONS
	)

	relations.sort((a, b) => a.matchPercent > b.matchPercent ? -1 : 1)
	saveRelatedCollectionsAndIndices(relations)
}

main();

