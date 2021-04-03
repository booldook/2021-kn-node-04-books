const express = require('express')
const router = express.Router()
const moment = require('moment')
const path = require('path')
// var upload = multer({ dest: path.join(__dirname, '../storages/') })
var { upload }  = require('../modules/multer-conn')
const pug = { title: '업로드', file: 'multer' }

router.get('/create', async (req, res, next) => {
	res.render('multer/create', pug)
})

router.post('/save', upload.single('upfile'), (req, res, next) => {
	res.json({ file: req.file })
})

module.exports = router