function delBook(id, page) {
	if(confirm('정말로 삭제하시겠습니까?')) {
		location.href = '/book/remove/'+id+'?page='+(page || 1)
	}
}