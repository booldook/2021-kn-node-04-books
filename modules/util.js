const path = require('path')
const { allowImgExt } = require('../modules/multer-conn')

const alert = (str, loc) => {
	return `
		<script>
			alert("${str}"); 
			${loc ? "location.href = '"+loc+"';" : "history.go(-1);"}
		</script>`
}

const filePath = (file) => {
	let refPath = `/uploads/${file.split('-')[0]}/${file}`
	let realPath = path.join(__dirname, '../storages/', file.split('-')[0], file)
	return { refPath, realPath }
}

const isImg = (file) => {
	return allowImgExt.includes(path.extname(file).substr(1).toLocaleLowerCase()) ? true : false
}

module.exports = { alert, filePath, isImg }