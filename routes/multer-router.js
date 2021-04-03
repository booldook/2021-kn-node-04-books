const express = require('express')
const router = express.Router()
const moment = require('moment')
const path = require('path')
const { alert } = require('../modules/util')
// var upload = multer({ dest: path.join(__dirname, '../storages/') })
var { upload }  = require('../modules/multer-conn')
const pug = { title: '업로드', file: 'multer' }

router.get('/create', async (req, res, next) => {1
	res.render('multer/create', pug)
})

router.post('/save', upload.single('upfile'), (req, res, next) => {
	if(req.banExt) {
		res.send(alert(req.banExt + '는 업로드가 허용되지 않습니다.'))
	}
	else {
		if(req.file) {
			res.json({ file: req.file })
		}
		else {
			res.send('파일없이 저장')
		}
	}
})

module.exports = router