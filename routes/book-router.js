const express = require('express')
const router = express.Router()
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
	password: '000000',
  database: 'booldook'
});

router.get('/', (req, res, next) => {
	let sql = 'SELECT * FROM books ORDER BY id DESC'
	connection.query(sql, (err, result) => {
		res.json(result);
	})
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