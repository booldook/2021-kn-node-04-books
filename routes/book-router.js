const express = require('express')
const router = express.Router()
const { pool } = require('../modules/mysql-conn')

router.get('/', async (req, res, next) => {
	let sql = 'SELECT * FROM books ORDER BY id DESC'
	const connect = await pool.getConnection()
	const result = await connect.query(sql)
	connect.release()
	res.json(result[0])
})

router.get('/create', (req, res, next) => {
	res.render('book/create')
})

router.get('/save', (req, res, next) => {
	let sql = 'INSERT INTO books SET bookName=?, writer=?, content=?'
	let values = [req.query.bookName, req.query.writer, req.query.content]
	connection.query(sql, values, (err, result) => {
		res.redirect('/book')
	})
})

module.exports = router