function validUserid() {
	var userid = $('form[name="joinForm"]').find('input[name="userid"]').val().trim()
	if(userid) {
		$.get('/auth/api/valid-userid', { userid: userid }, function(res, status, xhr) {
			if(res.code == 200) {
				$('.valid-userid').text('멋진 아이디입니다.')
			}
			else {
				$('.valid-userid').text('사용할 수 없습니다. 다른 아이디를 생각해 보세요')
			}
		})
	}
}