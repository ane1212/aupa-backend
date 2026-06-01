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

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.params.id as string)
        res.json(user)
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await updateUserService(req.params.id as string, req.body)
        res.json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const user = await updateUserRoleService(req.params.id as string, req.body.role)
        res.json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        await deleteUserService(req.params.id as string)
        res.json({ message: 'Cuenta eliminada correctamente' })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        const user = await updateAvatarService(req.params.id as string, req.body.avatar)
        res.json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService()
        res.json(users)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.params.id as string)
        res.json(user)
    } catch (error: any) {
        res.status(404).json({ message: error.message })
    }
}

export const toggleUserActive = async (req: Request, res: Response) => {
    try {
        const user = await toggleUserActiveService(req.params.id as string)
        res.json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}