const express = require('express')
const moment = require('moment')
const joi = require('../middlewares/joi-mw')
const pager = require('../modules/pager-conn')
const router = express.Router()
const { pool } = require('../modules/mysql-conn')
const pug = { title: '도서관리', file: 'book' }

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	try {
		let page, connect, sql, values;
		page = req.params.page || 1
		connect = await pool.getConnection()
		sql = 'SELECT count(*) FROM books'
		const [[recordCount]] = await connect.query(sql)
		const pageObj = pager(page, recordCount['count(*)'])
		sql = 'SELECT * FROM books ORDER BY id DESC LIMIT ?, ?'
		const [rs] = await connect.query(sql, [pageObj.startRec, pageObj.listCnt])
		connect.release()
		const books = rs.map(v => {
			v.createdAt = moment(v.createdAt).format('YYYY-MM-DD')
			return v;
		})
		res.render('book/list', { ...pug, books, pager: pageObj })
	}
	catch(err) {
		next(err)
	}
})

router.get('/create', (req, res, next) => {
	res.render('book/create', pug)
})

router.post('/save', joi('book'), async (req, res, next) => {
	try {
		let { bookName, writer, content } = req.body
		let sql = 'INSERT INTO books SET bookName=?, writer=?, content=?'
		let values = [bookName, writer, content]
		const connect = await pool.getConnection()
		const [result] = await connect.query(sql, values)
		connect.release()
		res.redirect('/book')
	}
	catch(err) {
		next(err)
	}
})

router.get('/remove/:id', async (req, res, next) => {
	try {
		let sql = 'DELETE FROM books WHERE id='+req.params.id
		const connect = await pool.getConnection()
		const [result] = await connect.query(sql)
		connect.release()
		res.redirect('/book/list/'+(req.query.page || 1))
	}
	catch(err) {
		next(err)
	}
})

router.get('/view/:id', async (req, res, next) => {
	try {
		let sql, connect
		sql = 'SELECT * FROM books WHERE id='+req.params.id
		connect = await pool.getConnection()
		const [[rs]] = await connect.query(sql)
		rs.createdAt = moment(rs.createdAt).format('YYYY-MM-DD')
		res.render('book/view', { ...pug, rs, page: req.query.page || 1 })
	}
	catch(err) {
		next(err)
	}
})

router.get('/chg/:id', async (req, res, next) => {
	let sql, connect
	sql = 'SELECT * FROM books WHERE id='+req.params.id
	connect = await pool.getConnection()
	const [[rs]] = await connect.query(sql)
	res.render('book/update', { ...pug, rs, page: req.query.page || 1 })
})

router.post('/update', async (req, res, next) => {
	let { bookName, writer='', content, id, page, sql=null, connect=null } = req.body
	res.json({
		bookName, writer, content, id, page, sql, connect
	})
})

module.exports = router