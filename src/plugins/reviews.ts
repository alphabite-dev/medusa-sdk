import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { PaginatedInput, PaginatedOutput } from './types'
import { CustomerDTO, ProductDTO } from '@medusajs/types'

export interface AggregateCounts {
  average: number
  counts: { rating: number; count: number }[]
  product_id?: string
  total_count: number
}

export interface Review {
  title: string
  content: string
  rating: number
  id: string
  created_at: string
  image_urls: string[]
  is_verified_purchase: boolean
  product_id: string
  customer: Pick<CustomerDTO, 'first_name' | 'last_name'>
  product?: Pick<ProductDTO, 'thumbnail' | 'title' | 'handle' | 'id'> &
    AggregateCounts
}

export interface CreateReviewInput {
  content: string
  rating: number
  product_id: string
  image_urls: string[]
  title?: string
}

export interface CreateReviewOutput extends Review {}

export interface ListReviewsInput extends PaginatedInput {
  product_ids?: string[]
  my_reviews_only?: boolean
  verified_purchase_only?: boolean
  rating?: number
  include_product?: boolean
  sort_by?: 'created_at' | 'rating'
  order?: 'asc' | 'desc'
}

export interface ListReviewsOutput extends PaginatedOutput<Review> {}

export interface ListProductReviewsInput
  extends Omit<ListReviewsInput, 'product_ids'> {
  product_id: string
}

export interface ListProductReviewsOutput
  extends PaginatedOutput<Omit<Review, 'product'>>,
    AggregateCounts {}

export interface DeleteReviewInput {
  id: string
}

export interface DeleteReviewOutput {
  id: string
}

export interface AggregateCountsInput {
  product_id: string
  verified_purchase_only?: boolean
}

export interface AggregateCountsOutput extends AggregateCounts {}

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
}

export const reviewsPlugin: Plugin<'reviews', ReviewsEndpoints> = {
  name: 'reviews' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
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
      sdk.client.fetch(`store/reviews/product/${product_id}`, {
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
  }),
}
