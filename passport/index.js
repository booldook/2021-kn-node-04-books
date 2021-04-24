const { pool } = require('../modules/mysql-conn')
const local = require('./local')
const kakao = require('./kakao')

module.exports = (passport) => {

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser(async (id, done) => {
		try {
			let sql, connect
			sql = 'SELECT id, userid, email FROM users WHERE id='+id
			connect = await pool.getConnection()
			let [rs] = await connect.query(sql)
			connect.release()
			done(null, rs[0])
		}
		catch(e) {
			done(e)
		}
	})

	local(passport)
	kakao(passport)
}