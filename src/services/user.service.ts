import { User } from '@/models'
import { CreateUserDto, UpdateUserDto } from '@/dtos'
import { UserRole } from '@/enums'
import { AppError, ErrorCode } from '@/utils'

export const createUserService = async (data: CreateUserDto) => {
    await User.create({ ...data, role: data.role ?? UserRole.USER })
}

export const getUserByIdService = async (id: string) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    })
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    return user
}

export const getAllUsersService = async () => {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    })
}

export const updateUserService = async (id: string, data: UpdateUserDto) => {
    const user = await User.findByPk(id)
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    const allowedData: UpdateUserDto = {}
    if (data.name !== undefined) allowedData.name = data.name
    if (data.avatar !== undefined) allowedData.avatar = data.avatar

    await user.update(allowedData, { fields: ['name', 'avatar'] })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const updateUserRoleService = async (id: string, role: UserRole) => {
    if (!Object.values(UserRole).includes(role)) throw new AppError(ErrorCode.VALIDATION_ERROR, 400)
    const user = await User.findByPk(id)
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    await user.update({ role })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const deleteUserService = async (id: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    await user.destroy()
}

export const toggleUserActiveService = async (id: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    await user.update({ active: !user.active })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}

export const updateAvatarService = async (id: string, avatar: string) => {
    const user = await User.findByPk(id)
    if (!user) throw new AppError(ErrorCode.USER_NOT_FOUND, 404)
    await user.update({ avatar })
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
}
