// LIMIT startRec, listCnt
// obj = { listCnt: 5, pageCnt: 3 }
const pager = (page, totalRec, obj={}) => {
	page = Number(page)
	totalRec = Number(totalRec)
	obj.page = page
	obj.listCnt = obj.listCnt || 3
	obj.pageCnt = obj.pageCnt || 3
	obj.totalRec = totalRec
	obj.lastPage = Math.ceil(obj.totalRec / obj.listCnt)
	obj.startRec = (page - 1) * obj.listCnt
	obj.startIdx = Math.floor((page - 1)/obj.pageCnt) * obj.pageCnt + 1;
	obj.endIdx = obj.startIdx + obj.pageCnt - 1 > obj.lastPage ? obj.lastPage : obj.startIdx + obj.pageCnt - 1
	obj.nextPage = page + 1 > obj.lastPage ? 0 : page + 1
	obj.prevPage = page - 1
	obj.nextPager = obj.endIdx + 1 > obj.lastPage ? 0 : obj.endIdx + 1
	obj.prevPager = obj.startIdx - 1
	return obj
}

module.exports = pager