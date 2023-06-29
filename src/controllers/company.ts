import mongoose from 'mongoose'
import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Request from '../types/Request'
import { User } from '../models/User'
import { createCompanySchema } from '../models/Company'
import CompanySchema from '../schemas/Company'

export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found, unable to create company' })
      return
    }

    const { error, value } = CompanySchema.validate(req.body)
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
      return
    }

    // e.g. abc.crankbit.net
    const { domain } = value

    const tenantsConnection = mongoose.createConnection(`${process.env.MONGO_BASE_URI}/tenants`)
    const CompanyModel = createCompanySchema(tenantsConnection)

    const companyExsits = await CompanyModel.findOne({ domain })
    if (companyExsits) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Company name already in use' })
      return
    }

    const company = await CompanyModel.create({ domain })

    user.companies.push(company)
    await user.save()

    const companyConnection = mongoose.createConnection(`${process.env.MONGO_BASE_URI}/${domain.split('.')[0]}`)
    const CompanyDBModel = createCompanySchema(companyConnection)
    await CompanyDBModel.create({ _id: company._id, domain })

    res.status(StatusCodes.CREATED).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        companies: user.companies,
      },
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
  }
}

// NOTE: This controller is for auth user to check their own companies created, not for ADMIN to check all companies in database, might add in the future
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found, unable to check company' })
      return
    }

    const { id } = req.params
    const company = user.companies.find((comp) => comp._id.toString() === id)
    res.status(StatusCodes.OK).json(company)
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error)
  }
}
