const alert = (str, loc) => {
	return `
		<script>
			alert("${str}"); 
			${loc ? "location.href = '"+loc+"';" : "history.go(-1);"}
		</script>`
}

module.exports = { alert }