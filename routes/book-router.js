const express = require('express')
const moment = require('moment')
const path = require('path')
const joi = require('../middlewares/joi-mw')
const pager = require('../modules/pager-conn')
const router = express.Router()
const { alert, filePath, isImg } = require('../modules/util')
const { pool } = require('../modules/mysql-conn')
const { upload, allowImgExt } = require('../modules/multer-conn')
const pug = { title: '도서관리', file: 'book' }
const fs = require('fs-extra')

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	try {
		let page, connect, sql, values;
		page = req.params.page || 1
		sql = 'SELECT count(*) FROM books'
		connect = await pool.getConnection()
		const [[recordCount]] = await connect.query(sql)
		connect.release()
		const pageObj = pager(page, recordCount['count(*)'])
		sql = 'SELECT * FROM books ORDER BY id DESC LIMIT ?, ?'
		connect = await pool.getConnection()
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

router.post('/save', upload.single('upfile'), joi('bookSave'), async (req, res, next) => {
	try {
		if(req.banExt) {
			res.send(alert(req.banExt + '는 업로드가 허용되지 않습니다.'))
		}
		else {
			let { bookName, writer, content, sql='', values=[], connect=null } = req.body
			sql = 'INSERT INTO books SET bookName=?, writer=?, content=?'
			values = [bookName, writer, content]
			connect = await pool.getConnection()
			const [result] = await connect.query(sql, values)
			connect.release()
			if(req.file) {
				sql = 'INSERT INTO files SET bookid=?, oriname=?, savename=?'
				values = [result.insertId, req.file.originalname, req.file.filename]
				connect = await pool.getConnection()
				const [result2] = await connect.query(sql, values)
				connect.release()
			}
			res.redirect('/book')
		}
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
		sql = `
		SELECT books.*, files.id AS fid, files.oriname, files.savename FROM books LEFT JOIN files ON 
		books.id = files.bookid 
		WHERE books.id=${req.params.id}`
		connect = await pool.getConnection()
		const [[rs]] = await connect.query(sql)
		connect.release()
		rs.createdAt = moment(rs.createdAt).format('YYYY-MM-DD')
		if(rs.savename && isImg(rs.savename)) {
			rs.src = filePath(rs.savename).refPath
		}
		res.render('book/view', { ...pug, rs, page: req.query.page || 1 })
	}
	catch(err) {
		next(err)
	}
})

router.get('/chg/:id', async (req, res, next) => {
	try {
		let sql, connect
		sql = `
		SELECT books.*, files.id AS fid, files.oriname, files.savename FROM books
		LEFT JOIN files 
		ON books.id = files.bookid 
		WHERE books.id=${req.params.id}`
		connect = await pool.getConnection()
		const [[rs]] = await connect.query(sql)
		connect.release()
		if(rs.savename && isImg(rs.savename)) {
			rs.src = filePath(rs.savename).refPath
		}
		res.render('book/update', { ...pug, rs, page: req.query.page || 1 })
	}
	catch(err) {
		next(err)
	}
})

router.post('/update', joi('bookUpdate'), async (req, res, next) => {
	try {
		let { bookName, writer, content, id, page, sql=null, values=[], connect=null } = req.body
		sql = 'UPDATE books SET bookName=?, writer=?, content=? WHERE id=?'
		values = [bookName, writer, content, id]
		connect = await pool.getConnection()
		let [rs] = await connect.query(sql, values)
		connect.release()
		res.redirect('/book/list/'+(page || 1))
	}
	catch(err) {
		console.log(err)
		next(err)
	}
})

router.get('/download/:id', async (req, res, next) => {
	try {
		let sql, connect;
		sql = 'SELECT * FROM files WHERE id='+req.params.id
		connect = await pool.getConnection()
		const [[rs]] = await connect.query(sql)
		connect.release()
		res.download(filePath(rs.savename).realPath, rs.oriname) // savename, oriname
	}
	catch(err) {
		next(err)
	}
})

router.get('/api/file-remove/:id', async (req, res, next) => {
	try {
		let sql, connect
		sql = 'SELECT * FROM files WHERE bookid='+req.params.id
		connect = await pool.getConnection()
		let [rs] = await connect.query(sql)
		connect.release()
		if(rs[0]) {
			await fs.remove(filePath(rs[0].savename).realPath)
			sql = 'DELETE FROM files WHERE bookid='+req.params.id
			connect = await pool.getConnection()
			await connect.query(sql)
			connect.release()
			res.json({ code: 200 })
		}
		else {
			res.json({ code: 404, error: '파일이 존재하지 않습니다' })
		}
	}
	catch(err) {
		next(err)
	}
})

module.exports = router