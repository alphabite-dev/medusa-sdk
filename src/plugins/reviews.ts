import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, AlphabiteMedusaConfig, Plugin } from '..'
import { PaginatedInput, PaginatedOutput } from './types'
import { CustomerDTO, FileDTO, ProductDTO } from '@medusajs/types'

/**
 * Aggregate rating statistics for products
 */
export interface AggregateCounts {
  /** Average rating across all reviews */
  average: number
  /** Distribution of ratings (count per rating value) */
  counts: { rating: number; count: number }[]
  /** Product ID for which these counts apply */
  product_id?: string
  /** Total number of reviews */
  total_count: number
}

/**
 * Represents a product review submitted by a customer
 */
export interface Review {
  /** Title of the review */
  title: string
  /** Detailed content of the review */
  content: string
  /** Rating value (typically 1-5) */
  rating: number
  /** Unique identifier for the review */
  id: string
  /** Timestamp when the review was created */
  created_at: string
  /** Array of image URLs attached to the review */
  image_urls: string[]
  /** Whether the reviewer purchased this product */
  is_verified_purchase: boolean
  /** ID of the reviewed product */
  product_id: string
  /** Customer information (name only) */
  customer: Pick<CustomerDTO, 'first_name' | 'last_name'>
  /** Optional product details with aggregate ratings */
  product?: Pick<ProductDTO, 'thumbnail' | 'title' | 'handle' | 'id'> &
    AggregateCounts
}

/** Input for creating a new review */
export interface CreateReviewInput {
  /** Detailed content of the review */
  content: string
  /** Rating value (typically 1-5) */
  rating: number
  /** ID of the product being reviewed */
  product_id: string
  /** Array of image URLs to attach to the review */
  image_urls: string[]
  /** Optional title for the review */
  title?: string
}

/** Response after creating a review */
export interface CreateReviewOutput extends Review {}

/** Input for listing reviews with filters and pagination */
export interface ListReviewsInput extends PaginatedInput {
  /** Filter by specific product IDs */
  product_ids?: string[]
  /** Show only reviews by the current user */
  my_reviews_only?: boolean
  /** Show only reviews from verified purchases */
  verified_purchase_only?: boolean
  /** Filter by specific rating value */
  rating?: number
  /** Include product details in the response */
  include_product?: boolean
  /** Field to sort by */
  sort_by?: 'created_at' | 'rating'
  /** Sort order */
  order?: 'asc' | 'desc'
}

/** Response containing paginated review data */
export interface ListReviewsOutput extends PaginatedOutput<Review> {}

/** Input for listing reviews of a specific product */
export interface ListProductReviewsInput
  extends Omit<ListReviewsInput, 'product_ids'> {
  /** Product ID to get reviews for */
  product_id: string
  /** Include aggregate counts in the response */
  include_aggregated_counts?: boolean
}

/** Response containing paginated product reviews with aggregate counts */
export interface ListProductReviewsOutput
  extends PaginatedOutput<Omit<Review, 'product'>>,
    AggregateCounts {}

/** Input for deleting a review */
export interface DeleteReviewInput {
  /** Review ID to delete */
  id: string
}

/** Response after deleting a review */
export interface DeleteReviewOutput {
  /** ID of the deleted review */
  id: string
}

/** Input for getting aggregate rating counts */
export interface AggregateCountsInput {
  /** Product ID to get aggregate counts for */
  product_id: string
  /** Only count reviews from verified purchases */
  verified_purchase_only?: boolean
}

/** Response containing aggregate rating statistics */
export interface AggregateCountsOutput extends AggregateCounts {}

/** Input for uploading review image files */
export interface UploadImageFilesInput {
  /** FormData containing the image files to upload */
  formData: FormData
}

type ReviewsEndpoints = {
  create: (
    input: CreateReviewInput,
    headers?: ClientHeaders,
  ) => Promise<CreateReviewOutput>
  list: (
    input: ListReviewsInput,
    headers?: ClientHeaders,
  ) => Promise<ListReviewsOutput>
  listProductReviews: (
    input: ListProductReviewsInput,
    headers?: ClientHeaders,
  ) => Promise<ListProductReviewsOutput>
  delete: (
    input: DeleteReviewInput,
    headers?: ClientHeaders,
  ) => Promise<DeleteReviewOutput>
  aggregateCounts: (
    input: AggregateCountsInput,
    headers?: ClientHeaders,
  ) => Promise<AggregateCountsOutput>
  uploadImageFiles: (
    input: UploadImageFilesInput,
    headers?: ClientHeaders,
  ) => Promise<FileDTO[]>
}

export const reviewsPlugin: Plugin<'reviews', ReviewsEndpoints> = {
  name: 'reviews' as const,
  endpoints: (
    sdk: Medusa,
    options?: AlphabiteClientOptions,
    medusaConfig?: AlphabiteMedusaConfig,
  ) => ({
    create: async (input, headers) =>
      sdk.client.fetch('/store/reviews', {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    list: async ({ ...input }, headers) =>
      sdk.client.fetch(`/store/products/reviews`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: input,
      }),
    listProductReviews: async ({ product_id, ...input }, headers) =>
      sdk.client.fetch(`/store/reviews/product/${product_id}`, {
        method: 'GET',
        query: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    aggregateCounts: async ({ product_id, ...input }, headers) =>
      sdk.client.fetch(
        `/store/reviews/product/${product_id}/aggregate-counts`,
        {
          method: 'GET',
          query: input,
          headers: {
            ...(await options?.getAuthHeader?.()),
            ...headers,
          },
        },
      ),
    delete: async ({ id }, headers) =>
      sdk.client.fetch(`/store/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    uploadImageFiles: async (input, headers) => {
      const baseUrl = medusaConfig?.baseUrl
      const publishableKey = medusaConfig?.publishableKey

      if (!baseUrl || !publishableKey) {
        throw new Error('Missing baseUrl or publishableKey')
      }

      const uploadedFiles = await fetch(
        `${baseUrl}/store/reviews/files/images/upload`,
        {
          method: 'POST',
          body: input.formData,
          headers: {
            ...headers,
            'x-publishable-api-key': publishableKey,
          },
        },
      )

      return await uploadedFiles.json()
    },
  }),
}
