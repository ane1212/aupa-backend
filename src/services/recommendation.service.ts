import { AppError, ErrorCode } from '@/utils'

export const getRecommendationsService = async (
    lat: number,
    len: number,
    categories: string[]
): Promise<unknown> => {
    const baseUrl = process.env.DATA_API_URL

    const params = new URLSearchParams()
    params.set('latitude', lat.toString())
    params.set('longitude', len.toString())
    for (const cat of categories) {
        params.append('categories', cat)
    }

    const url = `${baseUrl}?${params.toString()}`
    const response = await fetch(url)
    if (!response.ok) {
        const body = await response.text()
        throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR, 502)
    }
    return response.json()
}
