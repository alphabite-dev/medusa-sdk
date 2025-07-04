import {
  FindParams,
  RemoteQueryFunctionReturnPagination,
} from '@medusajs/types'

export interface PaginatedOutput<T> extends PaginatedOutputMeta {
  data: T[]
}

export interface PaginatedOutputMeta
  extends RemoteQueryFunctionReturnPagination {
  totalPages: number
  currentPage: number
  nextPage: number
  prevPage: number
}

export interface PaginatedInput extends FindParams {}
