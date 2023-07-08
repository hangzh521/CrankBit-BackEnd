import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { StatusCodes } from 'http-status-codes'
import { Tenant } from '../models/Tenant'

const googleClientID = '264769244889-95bgnueaifvs0opqnclmv1ib0bkhm37a.apps.googleusercontent.com'
const googleClientSecret = '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'

const googleLoginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
}

const googleLoginCallbackController = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { displayName, emails, id } = request.user as Profile
    const tenantExists = await Tenant.findOne({ email: emails[0].value })
    if (!tenantExists) {
      const tenant = await Tenant.create({
        name: displayName,
        email: emails[0].value,
        password: id,
      })
      const token = tenant.createJwt()
      response.status(StatusCodes.CREATED).json({
        msg: 'Sign in successfully',
        tenant: {
          tenantId: tenant._id,
          name: tenant.name,
          email: tenant.email,
        },
        token,
      })
    } else {
      const tenant = await Tenant.findOne({ email: emails[0].value })
      const token = tenant.createJwt()
      response.status(StatusCodes.CREATED).json({
        msg: 'Sign in successfully',
        tenant: {
          tenantId: tenant._id,
          name: tenant.name,
          email: tenant.email,
        },
        token,
      })
    }
  } catch (error) {
    next(error)
  }
}
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/api/v1/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('accessToken', accessToken)
      console.log('refreshToken', refreshToken)
      console.log('profile', profile)
      done(null, profile)
    }
  )
)
export { googleLoginController, googleLoginCallbackController }
