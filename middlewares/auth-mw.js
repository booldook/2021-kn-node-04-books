const { alert } = require('../modules/util')

const isUser = (req, res, next) => {
	if(req.session && req.session.user) next()
	else {
		res.send(alert('권한이 없습니다. 로그인 후 사용하세요.', '/auth/login'))
	}
}

const isGuest = (req, res, next) => {
	if(!req.session || !req.session.user) next()
	else {
		res.send(alert('비회원만 사용가능 합니다.', '/'))
	}
}

module.exports = { isUser, isGuest }