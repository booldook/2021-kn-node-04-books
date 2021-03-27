const express = require('express')
const moment = require('moment')
const router = express.Router()
const { pool } = require('../modules/mysql-conn')
const pug = { title: '도서관리', file: 'book' }

router.get('/', async (req, res, next) => {
	try {
		let sql = 'SELEC * FROM books ORDER BY id DESC'
		const connect = await pool.getConnection()
		const [result] = await connect.query(sql)
		connect.release()
		const books = result.map(v => {
			v.createdAt = moment(v.createdAt).format('YYYY-MM-DD')
			return v;
		})
		res.render('book/list', { ...pug, books })
	}
	catch(err) {
		next(err)
	}
})

router.get('/create', (req, res, next) => {
	res.render('book/create', pug)
})

router.post('/save', async (req, res, next) => {
	try {
		let { bookName, writer, content } = req.body
		let sql = 'INSERT INTO books SET bookName=?, writer=?, content=?'
		let values = [bookName, writer, content]
		const connect = await pool.getConnection()
		const [result] = connect.query(sql, values)
		connect.release()
		res.redirect('/book')
	}
	catch(err) {
		next(err)
	}
})

module.exports = router