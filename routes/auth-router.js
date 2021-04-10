const express = require('express')
const router = express.Router()

const pug = { title: '회원관리', file: 'auth' }

router.get('/join', (req, res, next) => {
	pug.title += ' - 회원가입'
	res.render('auth/join', pug)
})



module.exports = router