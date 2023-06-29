import Joi from 'joi'

const CompanySchema = Joi.object({
  domain: Joi.string()
    .required()
    .min(3)
    .max(30)
    .regex(/^[A-Za-z0-9_-]+\.crankbit\.net$/)
    .error(new Error('Please provide a valid domain name ending with ".crankbit.net".')),
})

export default CompanySchema
