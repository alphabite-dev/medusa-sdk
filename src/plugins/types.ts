export interface PaginatedOutput<T> extends PaginatedOutputMeta {
  data: T[]
}

export interface PaginatedOutputMeta {
  count: number
  limit: number
  offset: number
  totalPages: number
}

export interface PaginatedInput {
  limit?: number
  offset?: number
}
