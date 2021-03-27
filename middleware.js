const express = require('express')
const app = express()
app.listen(3001, () => {console.log('http://127.0.0.1:3001')})

// 1번 방식
app.use((req, res, next) => {
	req.msg = '미들웨어1번'
	next()
})

// 2번 방식
const mw2 = (req, res, next) => {
	req.msg2 = '미들웨어2번'
	next()
}

// 3번 방식
const mw3 = (value) => {
	return (req, res, next) => {
		req.msg3 = '미들웨어 '+value
		next()
	}
}

// 4번 방식 - 미들웨어 안에서 실행
const mw4 = (req, res, next) => {
	req.msg2 = '미들웨어2번'
	// next()
}


app.get('/1', (req, res, next) => {
	res.json({
		mw1: req.msg,
		mw2: req.msg2
	})
})

app.get('/2', mw2, mw3('book'), (req, res, next) => {
	mw4(req, res, next)
	res.json({
		mw1: req.msg,
		mw2: req.msg2,
		mw3: req.msg3,
	})
})