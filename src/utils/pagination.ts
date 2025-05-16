// src/utils/pagination.ts

export const paginate = <T>(data: T[], page: number, pageSize: number): T[] => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
};
