
var isValidUserid = false
function validUserid() {
	var userid = $('form[name="joinForm"]').find('input[name="userid"]').val().trim()
	if(userid) {
		$.get('/auth/api/valid-userid', { userid: userid }, function(res, status, xhr) {
			console.log(res, status, xhr)
			if(res.error) {
				console.log(res.error)
				isValidUserid = false
			}
			else if(res.code == 200) {
				$('.valid-userid').text('멋진 아이디입니다.')
				isValidUserid = true
			}
			else {
				$('.valid-userid').text('사용할 수 없습니다. 다른 아이디를 생각해 보세요')
				isValidUserid = false
			}
		})
	}
	else {
		$('.valid-userid').text('아이디를 입력하세요.')
		isValidUserid = false
	}
}

function onJoin(f) {
	if(!isValidUserid) {
		alert('아이디를 확인하세요.')
		f.userid.focus()
		return false
	}
	if(f.userpw.value === '' || f.userpwReview.value === '' || f.userpw.value !== f.userpwReview.value) {
		alert('패스워드를 확인하세요.')
		f.userpw.focus()
		return false
	}
	if(f.email.value.trim() === '') {
		alert('이메일을 확인하세요.')
		f.email.focus()
		return false
	}
	return true
}

function onLogon(f) {
	if(f.userid.value.trim() === '') {
		alert('아이디를 확인하세요.')
		f.userid.focus()
		return false
	}
	if(f.userpw.value.trim() === '') {
		alert('패스워드를 확인하세요.')
		f.userpw.focus()
		return false
	}
	return true
}