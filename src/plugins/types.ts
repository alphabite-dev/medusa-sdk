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

export interface MedusaImage {
  id: string
  url: string
  rank: number
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ProductCategoryImage extends MedusaImage {
  product_category_id: string
}

export interface ProductCollectionImage extends MedusaImage {
  product_collection_id: string
}

export interface ProductVariantImage extends MedusaImage {
  product_variant_id: string
}
