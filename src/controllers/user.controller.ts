import { Request, Response } from 'express'
import {
    getUserByIdService,
    getAllUsersService,
    updateUserService,
    deleteUserService,
    toggleUserActiveService,
    updateAvatarService,
    updateUserRoleService
} from '@/services'
import { AppError } from '@/utils'

const handleError = (error: unknown, res: Response) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ code: error.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.user!.id)
        res.json(user)
    } catch (error) { handleError(error, res) }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await updateUserService(req.user!.id, req.body)
        res.json(user)
    } catch (error) { handleError(error, res) }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const user = await updateUserRoleService(req.params.id as string, req.body.role)
        res.json(user)
    } catch (error) { handleError(error, res) }
}

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        await deleteUserService(req.user!.id)
        res.json({ code: 'USER_DELETED' })
    } catch (error) { handleError(error, res) }
}

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        if (!req.body.avatar) return res.status(400).json({ code: 'VALIDATION_ERROR' })
        const user = await updateAvatarService(req.user!.id, req.body.avatar)
        res.json(user)
    } catch (error) { handleError(error, res) }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService(req.query)
        res.json(users)
    } catch (error) { handleError(error, res) }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.params.id as string)
        res.json(user)
    } catch (error) { handleError(error, res) }
}

export const toggleUserActive = async (req: Request, res: Response) => {
    try {
        const user = await toggleUserActiveService(req.params.id as string)
        res.json(user)
    } catch (error) { handleError(error, res) }
}