const KakaoStrategy = require('passport-kakao').Strategy
const { pool } = require('../modules/mysql-conn')

const cb = async (accessToken, refreshToken, profile, done) => {
	try {
		let sql, connect, values
		let user = {
			accessToken,
			username: profile.username,
			email: profile._json.kakao_account.email
		}
		console.log('==================')
		console.log(accessToken)
		console.log('==================')
		console.log(refreshToken)
		console.log('==================')
		console.log(profile)
		sql = 'SELECT * FROM users WHERE api=? AND api_id=?'
		values = ['KA', profile.id]
		connect = await pool.getConnection()
		const [rs] = await connect.query(sql, values)
		connect.release()
		if(rs[0]) {
			user.id = rs[0].id
			sql = 'UPDATE users SET api_token=? WHERE id=?'
			values = [accessToken, user.id]
			connect = await pool.getConnection()
			const [rs2] = await connect.query(sql, values)
			connect.release()
		}
		else {
			sql = 'INSERT INTO users SET userid=?, userpw=?, email=?, api=?, api_id=?, api_token=?'
			values = [profile.id, '', user.email || '', 'KA', profile.id, accessToken]
			connect = await pool.getConnection()
			const [rs3] = await connect.query(sql, values)
			user.id = rs3.insertId
			connect.release()
		}
		done(null, user)
	}
	catch(err) {
		done(err)
	}
}

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID: process.env.KAKAO,
		callbackURL: '/auth/kakao/cb'
	}, cb))
}