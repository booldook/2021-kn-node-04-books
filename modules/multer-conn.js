const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')
const { v4: uuid4 } = require('uuid')
const moment = require('moment')

const storage = {}

const upload = multer({ storage })

module.exports = { upload }
