const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const moment = require('moment')

const stream = rfs.createStream(moment().format('YYYYMMDD')+'.log', {
	interval: '1d',
	path: path.join(__dirname, '../logs')
})

module.exports = (method = 'combined') => {
	return morgan(method, { stream })
}
