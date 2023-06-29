import mongoose, { Document, Model } from 'mongoose'

export interface ICompany extends Document {
  domain: string
}

export const createCompanySchema = (connection: mongoose.Connection): Model<ICompany> => {
  const CompanySchema = new mongoose.Schema({
    domain: {
      type: String,
      required: [true, 'Please enter your company name'],
      unique: true,
      validate: {
        validator(value: string): boolean {
          const pattern = /^[A-Za-z0-9_-]+\.crankbit\.net$/
          return pattern.test(value)
        },
        message: 'Please provide a valid domain name',
      },
      minlength: 3,
      maxlength: 30,
    },
  })

  return connection.model<ICompany>('Company', CompanySchema)
}
