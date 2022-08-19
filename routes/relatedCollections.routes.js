const fs = require('fs')
const express = require('express')
const router = express.Router()


router.get('/:minRelation?', (req, res) => {
	const min = parseFloat(req.params.minRelation)
	data = JSON.parse(fs.readFileSync(
		'data/finalData/sortedByMatch.json'
	))
	if(!min) return res.json(data)
	const minIndex = data.findIndex(x => x.matchPercent < min)
	return res.json(data.slice(0, minIndex))
})

module.exports = router
