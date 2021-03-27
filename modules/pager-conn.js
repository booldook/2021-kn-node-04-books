// LIMIT startRec, listCnt
// obj = { listCnt: 5, pageCnt: 3 }
const pager = (page, totalRec, obj={}) => {
	obj.listCnt = obj.listCnt || 5
	obj.pageCnt = obj.pageCnt || 3
	obj.totalRec = totalRec
	obj.lastPage = Math.ceil(totalRec / listCnt)
	obj.startRec = (page - 1) * obj.listCnt
	obj.startIdx = Math.floor((page - 1)/obj.pageCnt) * obj.pageCnt + 1;
	obj.endIdx = obj.startIdx + obj.pageCnt - 1 > obj.lastPage ? obj.lastPage : obj.startIdx + obj.pageCnt - 1
	obj.nextIdx = page + 1 > obj.lastPage ? 0 : page + 1
	obj.prevIdx = page - 1
	obj.nextPage = obj.endIdx + 1 > obj.lastPage ? 0 : obj.endIdx + 1
	obj.prevPage = obj.startIdx - 1
	return obj
}

module.exports = pager