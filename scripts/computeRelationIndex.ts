import {
	getCollectionHolders
} from './hyperLib'
const fs = require('fs')

const normalizeToPercent = (n: number): number => n < 0 || n > 1 ? 0 : n

/* Relation basic model */
const computeMatchPercent = (
	baseCollectionHolders: string[], childCollectionAddr: string
): number => {
	const derivHolds = new Set(await getCollectionHolders(childCollectionAddr))
	const intersection = baseCollectionHolders.filter(
		holder => derivHolds.has(holder)
	)
	return normalizeToPercent(intersection.length / baseCollectionHolders.length)
}

type RelatedCollectionsWithIndex = [{
	contractAddress: string,
	matchPercent: number
}]

const updateRelationIndeces = (
	currentRelations: RelatedCollectionsWithIndex,
	baseCollectionHolders: string[],
	childCollectionAddr: string
): Promise<RelatedCollectionsWithIndex => {
	return [...currentRelations, {
		contractAddress: childCollectionAddr,
		matchPercent: computeMatchPercent(baseCollectionHolders, childCollectionAddr)
	}]	
}

const computeRelationIndexesOfCollections = (
	baseCollection: string, relatedCollections: string[]
): Promise<RelatedCollectionsWithIndex> => {
	const baseHolders = await getCollectionHolders(baseCollection)
	const rels: RelatedCollectionsWithIndex = []
	for (const collection of relatedCollections)
		rels = updateRelationIndeces(rels, baseHolders, collection)
	return rels
}

const saveRelatedCollectionsAndIndices = async (
	collections: RelatedCollectionsWithIndex[]
) => {
	fs.writeFile(
		'../data/sortedByRelationIndex.json',
		JSON.stringify(collections),
		(err: any) => {if (err) throw err}
	)
}

const main = async () => {
	const BASE_COLLECTION = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'
	const RELATED_COLLECTIONS = new Set(
		JSON.parse(fs.readFileSync('../data/derivHolds.json'))
	)
	const relations = await computeRelationIndexesOfCollections(
		BASE_COLLECTION, RELATED_COLLECTIONS
	)
	relations.sort((a, b) => a.matchPercent > b.matchPercent ? 1 : -1)
	saveRelatedCollectionsAndIndices(relations)
}


