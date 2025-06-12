import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { PaginatedOutput, PaginatedOutputMeta } from './types'

export interface ReviewsRatingAggregate {
  average: number
  counts: { rating: number; count: number }[]
}

export interface Review {
  title: string
  content: string
  first_name: string
  last_name: string
  rating: number
  id: string
  created_at: string
  image_urls?: string[]
}

export interface ListReviewsInput {
  product_id: string
  limit?: number
  pageParam?: number
}

export interface ListReviewsOutput extends PaginatedOutput<Review> {
  meta: PaginatedOutputMeta & {
    rating_aggregate: ReviewsRatingAggregate
  }
}

export interface CreateReviewInput {
  first_name: string
  last_name: string
  content: string
  rating: number
  product_id: string
  image_base64s: string[]
  title?: string | undefined
}

export interface CreateReviewOutput {
  review: Review
}

type ReviewsEndpoints = {
  list: (
    { product_id, limit, pageParam }: ListReviewsInput,
    headers?: ClientHeaders,
  ) => Promise<ListReviewsOutput>
  create: (
    input: CreateReviewInput,
    headers?: ClientHeaders,
  ) => Promise<CreateReviewOutput>
}

export const reviewsPlugin: Plugin<'reviews', ReviewsEndpoints> = {
  name: 'reviews' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    list: async ({ product_id, limit = 5, pageParam = 1 }, headers) =>
      sdk.client.fetch(`/store/products/${product_id}/reviews`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: {
          limit,
          offset: (Math.max(pageParam, 1) - 1) * limit,
        },
      }),
    create: async (input, headers) =>
      sdk.client.fetch('/store/reviews', {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
