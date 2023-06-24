import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { User, IUser } from '../models/User'

const createCompanyUrl = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params
  const { companyUrl } = req.body
  const companyUrlSchema = Joi.object({
    companyUrl: Joi.string().uri().required().label('Company URL'),
  })

  try {
    const user: IUser | null = await User.findById(userId)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    const { error, value } = companyUrlSchema.validate(companyUrl)
    if (error) {
      res.status(400).json({ message: error.message })
      return
    }
    const existingUrl = user.companyUrls.find((url) => url === value)
    if (existingUrl) {
      res.status(400).json({ message: 'Company URL already exists' })
      return
    }

    user.companyUrls.push(companyUrl)

    await user.save()

    res.status(200).json({ message: 'Company URL added successfully' })
    const token = user.createJwt()
    res.status(StatusCodes.OK).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add company URL' })
  }
}

export default createCompanyUrl
