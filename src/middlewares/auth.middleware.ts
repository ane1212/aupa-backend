import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserRole } from '@/enums'
import { User } from '@/models'
import { AppError, ErrorCode } from '@/utils'

export const isRegisterDataCorrect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, passwordRepeat } = req.body

    if (!name || !email || !password || !passwordRepeat) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400)
    }

    if (password !== passwordRepeat) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400)
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, 409)

    req.body.password = await bcrypt.hash(password, 10)

    next()
  } catch (error) {
    next(error)
  }
}

export const checkCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) throw new AppError(ErrorCode.VALIDATION_ERROR, 400)

    const user = await User.findOne({ where: { email } })
    if (!user) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401)

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401)

    req.user = { id: user.id, role: user.role }

    next()
  } catch (error) {
    next(error)
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401)
    }

    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string
      role: UserRole
    }

    req.user = payload
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(ErrorCode.INVALID_TOKEN, 401))
    }
    return next(new AppError(ErrorCode.INVALID_TOKEN, 401))
  }
}

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(ErrorCode.UNAUTHORIZED, 401))
    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AppError(ErrorCode.FORBIDDEN, 403))
    }
    next()
  }
}