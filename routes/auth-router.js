const express = require('express')
const router = express.Router()
const moment = require('moment')
const bcrypt = require('bcrypt')
const path = require('path')
const joi = require('../middlewares/joi-mw')
const { isUser, isGuest } = require('../middlewares/auth-mw')
const { alert } = require('../modules/util')
const { pool } = require('../modules/mysql-conn')

const pug = { file: 'auth' }

router.get('/join', isGuest, (req, res, next) => {
	pug.title = '회원가입'
	res.render('auth/join', pug)
})

router.post('/save', isGuest, async (req, res, next) => {
	try {
		let { userid, userpw, userpwReview, email } = req.body
		let sql, connect, values
		sql = 'SELECT userid FROM users WHERE userid=?'
		values = [userid]
		connect = await pool.getConnection()
		const rs = await connect.query(sql, values)
		connect.release()
		if(userpw === userpwReview && userid && email) {
			if(rs[0][0]) res.send(alert('아이디를 사용할 수 없습니다.'))
			else {
				sql = 'INSERT INTO users SET userid=?, userpw=?, email=?'
				userpw = await bcrypt.hash(userpw, Number(process.env.BCRYPT_ROUND))
				values = [userid, userpw, email]
				connect = await pool.getConnection()
				await connect.query(sql, values)
				connect.release()
				res.send(alert('회원가입이 되었습니다.', '/auth/login'))
			}
		}
		else res.send(alert('입력정보가 확인되지 않았습니다.'))
	}
	catch(err) {
		console.log(err)
		next(err)
	}
})

router.get('/login', isGuest, (req, res, next) => {
	pug.title = '회원 로그인'
	res.render('auth/login', pug)
})

router.post('/logon', isGuest, async (req, res, next) => {
	try {
		let sql, connect, values, compare
		let { userid, userpw } = req.body
		sql = 'SELECT * FROM users WHERE userid=?'
		values = [userid]
		connect = await pool.getConnection()
		const [rs] = await connect.query(sql, values)
		connect.release()
		if(rs[0]) {
			compare = await bcrypt.compare(userpw, rs[0].userpw)
			if(compare) {
				req.session.user = {
					id: rs[0].id,
					email: rs[0].email
				}
				res.redirect('/')
			}
			else res.send(alert('아이디와 패스워드가 올바르지 않습니다.'))
		}
		else res.send(alert('아이디와 패스워드가 올바르지 않습니다.'))
	}
	catch(err) {
		next(err)
	}
})

router.get('/logout', isUser, (req, res, next) => {
	req.session.destroy()
	req.app.locals.user = null
	res.redirect('/')
})

router.get('/api/valid-userid', isGuest, async (req, res, next) => {
	try {
		let sql, values, connect
		sql = 'SELECT userid FROM users WHERE userid=?'
		values = [req.query.userid]
		connect = await pool.getConnection()
		const [rs] = await connect.query(sql, values)
		connect.release()
		if(rs[0]) res.json({ code: 201 })
		else res.json({ code: 200 })
	}
	catch(error) {
		res.json({ error })
	}
})



module.exports = router