import { Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'

import Payload from '../types/Payload'
import Request from '../types/Request'

const authenticateTenant = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authorization denied' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authorization denied' })
    return
  }

  try {
    const payload: Payload | JwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    req.tenantId = payload.tenantId

    next()
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Authorization invalid' })
  }
}

export default authenticateTenant
