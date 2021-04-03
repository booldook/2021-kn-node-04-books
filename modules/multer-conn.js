const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')
const { v4: uuid4 } = require('uuid')
const moment = require('moment')

const destCb = (req, file, cb) => {
	try {
		let folder = path.join(__dirname, '../storages', moment().format('YYYYMMDD_HH'))
		fs.ensureDirSync(folder)
		console.log(cb)
		cb(null, folder)
	}
	catch(err) {
		cb(err)
	}
}

const fileCb = (req, file, cb) => {

}

const storage = multer.diskStorage({ destination: destCb, filename: fileCb })
const upload = multer({ storage })

module.exports = { upload }
