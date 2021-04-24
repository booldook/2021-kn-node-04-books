const KakaoStrategy = require('passport-kakao').Strategy
const { pool } = require('../modules/mysql-conn')

const cb = async (accessToken, refreshToken, profile, done) => {
	try {
		let sql, connect
		console.log('==================')
		console.log(accessToken)
		console.log('==================')
		console.log(refreshToken)
		console.log('==================')
		console.log(profile)
	}
	catch(err) {
		next(err)
	}
}

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID: process.env.KAKAO,
		callbackURL: '/auth/kakao/cb'
	}, cb))
}