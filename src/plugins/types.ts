export interface PaginatedOutput<T> {
  data: T[]
  meta: PaginatedOutputMeta
}

export interface PaginatedOutputMeta {
  count: number
  limit: number
  offset: number
  totalPages: number
}
