export interface GetPostsQueryInterface {
    search?: string,
    dateOrder?: 'asc' | 'desc',
    limit?: string,
    offset?: string,
}