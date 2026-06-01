import { AppError, ErrorCode } from '@/utils'
import { createUserService } from '@/services'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createUserService(req.body)
        return res.status(201).json({ code: 'USER_CREATED' })
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401)

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        )

        return res.status(200).json({ token })
    } catch (error) {
        next(error)
    }
}

export const authController = { register, login }