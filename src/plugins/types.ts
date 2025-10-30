import {
  FindParams,
  RemoteQueryFunctionReturnPagination,
} from '@medusajs/types'

/**
 * Standard paginated response structure for list endpoints
 * @template T - Type of the data items in the response
 */
export interface PaginatedOutput<T> extends PaginatedOutputMeta {
  /** Array of data items for the current page */
  data: T[]
}

/**
 * Pagination metadata included in paginated responses
 */
export interface PaginatedOutputMeta
  extends RemoteQueryFunctionReturnPagination {
  /** Total number of pages available */
  totalPages: number
  /** Current page number (1-indexed) */
  currentPage: number
  /** Next page number, 0 if on last page */
  nextPage: number
  /** Previous page number, 0 if on first page */
  prevPage: number
}

/**
 * Standard pagination parameters for list endpoints
 * Extends FindParams from Medusa types for consistent querying
 */
export interface PaginatedInput extends FindParams {}

/**
 * Base image structure used across Medusa entities
 */
export interface MedusaImage {
  /** Unique identifier for the image */
  id: string
  /** URL where the image is accessible */
  url: string
  /** Display order/priority of the image */
  rank: number
  /** Additional metadata associated with the image */
  metadata: Record<string, unknown> | null
  /** Timestamp when the image was created */
  created_at: string
  /** Timestamp when the image was last updated */
  updated_at: string
  /** Timestamp when the image was deleted, null if active */
  deleted_at: string | null
}

/**
 * Image associated with a product category
 */
export interface ProductCategoryImage extends MedusaImage {
  /** ID of the product category this image belongs to */
  product_category_id: string
}

/**
 * Image associated with a product collection
 */
export interface ProductCollectionImage extends MedusaImage {
  /** ID of the product collection this image belongs to */
  product_collection_id: string
}

/**
 * Image associated with a product variant
 */
export interface ProductVariantImage extends MedusaImage {
  /** ID of the product variant this image belongs to */
  product_variant_id: string
}
