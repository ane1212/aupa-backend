import { User } from '@/models/User'
import { UpdateUserDto } from '@/dtos/user.dto'
import { UserRole } from '@/enums'

export const getUserByIdService = async (id: string) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    })
    if (!user) throw new Error('Usuario no encontrado')
    return user
}

export const getAllUsersService = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    })
}

export const updateUserService = async (id: string, data: UpdateUserDto) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Usuario no encontrado')
    await user.update(data)
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const updateUserRoleService = async (id: string, role: UserRole) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Usuario no encontrado')
    await user.update({ role })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const deleteUserService = async (id: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Usuario no encontrado')
    await user.destroy()
}

export const toggleUserActiveService = async (id: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Usuario no encontrado')
    await user.update({ active: !user.active })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const updateAvatarService = async (id: string, avatar: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Usuario no encontrado')
    await user.update({ avatar })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}