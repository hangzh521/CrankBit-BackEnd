import { Response, NextFunction } from 'express'
import HttpStatusCodes from 'http-status-codes'
import jwt from 'jsonwebtoken'
import mongoose, { Connection } from 'mongoose'

import Payload from '../types/Payload'
import Request from '../types/Request'

// DBConnections
export interface DBConnectionsListType {
  [key: string]: Connection
}
const DBConnectionsList: DBConnectionsListType = {}

// Middleware to check if user is logged in
const requiredLogin = (req: Request, res: Response, next: NextFunction): void => {
  // Check authorization field in req.headers, e.g. authorization: 'Bearer ey...'
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Authentication Invalid')
  }

  // Get token from authorizaiton field
  const token = authHeader.split(' ')[1]

  // Check if no token
  if (!token) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ msg: 'Authorization denied' })
    return
  }
  // Verify token
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Payload | any = jwt.verify(token, process.env.JWT_SECRET)
    const { dbName } = payload
    req.userId = payload.userId

    if (DBConnectionsList[dbName]) {
      next()
    } else {
      DBConnectionsList[dbName] = mongoose.createConnection(process.env.MONGO_URI + dbName)
      // DBConnectionsList[dbName]['studentModel'] = dataBaseSchema.createSchema(DBConnectionsList[dbName])
      next()
    }
  } catch (err) {
    res.status(HttpStatusCodes.FORBIDDEN).json({ msg: 'Authorization invalid' })
  }
}

export default requiredLogin
