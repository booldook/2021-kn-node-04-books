const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { pool } = require('../modules/mysql-conn')

const cb = async (userid, userpw, done) => {
	try {
		let sql, connect, values, compare
		sql = 'SELECT * FROM users WHERE userid=?'
		values = [userid]
		connect = await pool.getConnection()
		const [rs] = await connect.query(sql, values)
		connect.release()
		if(rs[0]) {
			compare = await bcrypt.compare(userpw, rs[0].userpw)
			if(compare) done(null, rs[0])
			else done(null, false, '아이디와 패스워드를 확인하세요.')
		}
		else done(null, false, '아이디와 패스워드를 확인하세요.')
	}
	catch(e) {
		done(e)
	}
}

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'userpw'
	}, cb))
}