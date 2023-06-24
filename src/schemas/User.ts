import Joi from 'joi'

const UserSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6),
  companyUrls: Joi.array().items(Joi.string()),
})

export default UserSchema
