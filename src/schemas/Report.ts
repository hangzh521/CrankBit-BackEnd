import Joi from 'joi'

const ReportSchema = Joi.object({
  vehicle: Joi.string().required(),
  owner: Joi.string().min(3).max(50),
  service: Joi.string().required(),
  createdAt: Joi.string().isoDate().required(),
  description: Joi.string().required().label('Description'),
  status: Joi.string().valid('Pending', 'In Progress', 'Resolved').required().label('Status'),
  assignedTo: Joi.string().required().label('Assigned To'),
  attachments: Joi.array().items(Joi.string()).label('Attachments'),
  comments: Joi.array().items(Joi.string()).label('Comments'),
})

export default ReportSchema
