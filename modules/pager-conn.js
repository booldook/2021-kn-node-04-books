// LIMIT startRec, listCnt
// obj = { listCnt: 5, pageCnt: 3 }
const pager = (page, totalRs, obj={}) => {
	obj.listCnt = obj.listCnt || 5
	obj.pageCnt = obj.pageCnt || 3
	obj.startRec = (page - 1) * obj.listCnt

	return obj
}

module.exports = pager