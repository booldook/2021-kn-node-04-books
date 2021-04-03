const path = require('path')

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

module.exports = { alert, filePath }