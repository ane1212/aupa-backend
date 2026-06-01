import { Router } from 'express'
import { register, login } from '@/controllers'
import { isRegisterDataCorrect, checkCredentials } from '@/middlewares'

export const authRouter = Router()

authRouter.post('/register', isRegisterDataCorrect, register)
authRouter.post('/login', checkCredentials, login)