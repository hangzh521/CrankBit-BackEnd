import { Request, Response, response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail'
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
export const sendEmailResetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const tenant = await Tenant.findOne({ email })

  if (!tenant) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide a valid email address' })
    return
  }

  const token = tenant.resetPasswordToken()
  const linkText = 'click here to reset your password'
  const { name } = tenant
  const emailbody = `
    <p>Hello ${name}：</p>
    <p>A request has been received to change the password for your Form Builder account.</p>
    <button><a href="/reset-password?token=${token}">${linkText}</a></button>
    <p>If you did not make a request to reset your password, you can safely ignore this email. Only a person with access to your email can reset your password.</p>
    <p>Form Builder Team</p>
  `
  const msg: sgMail.MailDataRequired = {
    to: email,
    from: 'chao.long.au@gmail.com', // 添加发件人邮箱地址
    subject: 'Reset Password',
    html: emailbody,
  }

  try {
    await sgMail.send(msg)
    res.status(StatusCodes.OK).json({ msg: 'Email sent successfully' })
  } catch (err) {
    console.log(err.response.body.errors)
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email sent failed' })
  }
}
