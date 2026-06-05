import { Op, FindAndCountOptions, WhereOptions } from 'sequelize';
import { PaginationQuery } from '@/types';

export const buildQueryOptions = (
    query: PaginationQuery,
    searchFields: string[] = [],
    exactMatchFields: string[] = []
): Omit<FindAndCountOptions, 'group'> => {
    const page = query.page ? parseInt(query.page as any, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as any, 10) : 10;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    // Handle search (ILIKE)
    if (query.search && searchFields.length > 0) {
        Object.assign(where, {
            [Op.or]: searchFields.map(field => ({
                [field]: { [Op.iLike]: `%${query.search}%` }
            }))
        });
    }

    // Handle exact match filters
    exactMatchFields.forEach(field => {
        if (query[field] === undefined) return
        const val = query[field]
        if (val === 'true') where[field] = true
        else if (val === 'false') where[field] = false
        else where[field] = val
    });

    const options: Omit<FindAndCountOptions, 'group'> = {
        where,
        limit,
        offset,
    };

    // Handle sorting
    if (query.sortBy) {
        const order = query.sortOrder === 'DESC' ? 'DESC' : 'ASC';
        options.order = [[query.sortBy, order]];
    }

    return options;
};

export const getPaginatedResponse = <T>(
    result: { rows: T[]; count: number },
    page: number,
    limit: number
) => {
    return {
        data: result.rows,
        meta: {
            total: result.count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(result.count / limit),
        },
    };
};