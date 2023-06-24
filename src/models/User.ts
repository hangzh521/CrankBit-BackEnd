import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  companyUrls: string[]
  createJwt(): string
  comparePassword(inputPassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 6,
    select: false,
  },
  companyUrls: [
    {
      type: String,
      required: [true, 'please provide a company URL'],
    },
  ],
})

const saltRounds = 12

UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(saltRounds)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJwt = function (): string {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (inputPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, this.password)
  return isMatch
}

export const User = mongoose.model<IUser>('User', UserSchema)
