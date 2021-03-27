require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const createError = require('http-errors')

/************* Init ***************/
app.listen(process.env.PORT, () => { 
	console.log(process.env.HOST+':'+process.env.PORT) 
})
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))
app.locals.pretty = true

/************* Middleware ***************/


/************* Router ***************/
const bookRouter = require('./routes/book-router')
app.use('/', express.static( path.join(__dirname, './public') ))
app.use('/book', bookRouter)


/************* Router ***************/
app.use((req, res, next) => {
	next(createError(404))
})

app.use((err, req, res, next) => {
	res.send(err)
})