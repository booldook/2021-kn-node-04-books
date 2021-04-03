const Joi = require('joi')

const schemas = {
	bookSave: {
		bookName: Joi.string().max(255).required(),
		writer: Joi.string().max(255).required(),
		content: Joi.string(),
	},
	bookUpdate: {
		id: Joi.string().required(),
		page: Joi.string(),
		bookName: Joi.string().max(255).required(),
		writer: Joi.string().max(255).required(),
		content: Joi.string(),
	},
	join: {
		userid: Joi.string().min(8).max(24).required(),
		userpw: Joi.string().min(8).max(24).required(),
	}
}

const joiMiddleWare = (value) => {
	return async (req, res, next) => {
		try {
			const schema = Joi.object(schemas[value])
			await schema.validateAsync(req.body)
			next()
		}
		catch(err) {
			next(err)
		}
	}
}

module.exports = joiMiddleWare