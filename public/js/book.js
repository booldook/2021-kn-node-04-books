function delBook(id, page) {
	if(confirm('정말로 삭제하시겠습니까?')) {
		location.href = '/book/remove/'+id+'?page='+(page || 1)
	}
}

function fileRemove(id) {
	if(confirm('정말로 삭제하시겠습니까?')) {
		$.get('/book/api/file-remove/'+id, function(res, status, xhr) {
			console.log(res, status, xhr)
			if(res.code == 200) {
				$('.file-wrap').remove()
			}
		})
	}
}