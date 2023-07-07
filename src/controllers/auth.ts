import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { Tenant } from '../models/Tenant'
import TenantSchema from '../schemas/Tenant'
import Payload from '../types/Payload'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = TenantSchema.validate(req.body)

  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    return
  }

  const { name, email, password } = value

  const tenantExists = await Tenant.findOne({ email })
  if (tenantExists) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide another valid email address' })
    return
  }

  const tenant = await Tenant.create({ name, email, password })
  const token = tenant.createJwt()
  res.status(StatusCodes.CREATED).json({
    msg: 'Sign up successfully',
    tenant: {
      tenantId: tenant._id,
      name: tenant.name,
      email: tenant.email,
    },
    token,
  })
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = TenantSchema.validate(req.body)

  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    return
  }

  const { email, password } = value

  const tenant = await Tenant.findOne({ email }).select('+password')
  if (!tenant) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' })
  }

  const isPasswordCorrect = await tenant.comparePassword(password)
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' })
  }

  const token = tenant.createJwt()
  tenant.password = undefined
  res.status(StatusCodes.OK).json({
    tenant: {
      userId: tenant._id,
      name: tenant.name,
      email: tenant.email,
    },
    token,
  })
}
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { newPassword, token } = req.body
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as Payload
  if (!decoded) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' })
    return
  }
  const { tenantId } = decoded
  const tenant = await Tenant.findOne({ _id: tenantId })
  if (!tenant) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' })
    return
  }
  if (newPassword.length < 6) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Password must be at least 6 characters' })
    return
  }
  if (newPassword === tenant.password) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide a different password' })
    return
  }
  tenant.changedPasswords.push({
    password: tenant.password,
    createdAt: new Date(),
  })
  tenant.password = newPassword
  await tenant.save()
  res.status(StatusCodes.OK).json({
    msg: 'Password updated successfully',
  })
  const newToken = tenant.createJwt()
  tenant.password = undefined
  res.status(StatusCodes.OK).json({
    tenant: {
      userId: tenant._id,
      name: tenant.name,
      email: tenant.email,
    },
    newToken,
  })
}
