import Joi from 'joi'

const TenantSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
})

export default TenantSchema
