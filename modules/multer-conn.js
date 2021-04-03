const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')
const { v4: uuid4 } = require('uuid')
const moment = require('moment')

const allowImgExt = ['jpg', 'jpeg', 'png', 'gif']
const allowFileExt = ['txt', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'zip', 'xls', 'xlsx']
const allowExt = [...allowImgExt, ...allowFileExt]

const destCb = (req, file, cb) => {
	let folder = path.join(__dirname, '../storages', moment().format('YYYYMMDD_HH'))
	fs.ensureDirSync(folder)	// 폴더가 존재하면 패스, 없으면 만들고...(fs-extra)
	cb(null, folder)
}

const fileCb = (req, file, cb) => {
	let ext = path.extname(file.originalname)	//.jpg
	let name = moment().format('YYYYMMDD_HH') + '-' + uuid4() + ext
	cb(null, name)
}

const fileFilter = (req, file, cb) => {
	let ext = path.extname(file.originalname).substr(1).toLowerCase()
	if(allowExt.includes(ext)) {
		cb(null, true)
	}
	else {
		req.banExt = ext
		cb(null, false)
	}
}

const limits = { fileSize: 102400000 }

const storage = multer.diskStorage({ destination: destCb, filename: fileCb })
const upload = multer({ storage, fileFilter, limits })

module.exports = { upload }
