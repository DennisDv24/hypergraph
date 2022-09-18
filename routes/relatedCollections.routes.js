const fs = require('fs')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
	const min = parseFloat(req.query.minRelation)
	data = JSON.parse(fs.readFileSync(
		'data/sortedByRelationIndex.json'
	))
	if(!min) return res.json(data)
	const minIndex = data.findIndex(x => x.matchPercent < min)
	return res.json(data.slice(0, minIndex))
})

module.exports = router
