const fs = require('fs')
const express = require('express')
const router = express.Router()


router.get('/:minRelation?', (req, res) => {
	const min = req.params.minRelation
	data = JSON.parse(fs.readFileSync(
		'../data/finalData/sortedByMatch.json'
	))
	if(!min) return data
	const minIndex = data.findIndex(x => x <= min)
	return data.slice(0, minIndex + 1)
})

module.exports = router
