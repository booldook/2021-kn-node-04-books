const express = require('express')
const router = express.Router()
const moment = require('moment')
const path = require('path')
const joi = require('../middlewares/joi-mw')
const { alert } = require('../modules/util')
const { pool } = require('../modules/mysql-conn')

const pug = { file: 'auth' }

router.get('/join', (req, res, next) => {
	pug.title = '회원가입'
	res.render('auth/join', pug)
})

router.get('/api/valid-userid', async (req, res, next) => {
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