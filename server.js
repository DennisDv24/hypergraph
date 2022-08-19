const express = require('express')
const cors = require('cors')

require('dotenv').config({ path: './.env' })


const app = express()

PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use('/related-collections', require('./routes/relatedCollections.routes.js'))


app.listen(PORT, () => console.log(`Server on port ${PORT}`))




