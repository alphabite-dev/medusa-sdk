import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'

export interface ReviewsRatingAggregate {
  average: number
  counts: { rating: number; count: number }[]
}

export interface ReviewProps {
  title: string
  content: string
  first_name: string
  last_name: string
  rating: number
  id: string
  created_at: string
  image_urls?: string[]
}

export interface ReviewsOutput {
  count: number
  limit: number
  offset: number
  rating_aggregate: ReviewsRatingAggregate
  reviews: ReviewProps[]
  total_pages: number
}

export interface ReviewListProps {
  productId: string
  limit?: number
  pageParam?: number
}

type AddReviewInput = {
  first_name: string
  last_name: string
  content: string
  rating: number
  product_id: string
  image_base64s: string[]
  title?: string | undefined
}

type ReviewsEndpoints = {
  list: (
    { productId, limit, pageParam }: ReviewListProps,
    headers?: ClientHeaders,
  ) => Promise<ReviewsOutput>
  add: (
    input: AddReviewInput,
    headers?: ClientHeaders,
  ) => Promise<ReviewsOutput>
}

export const reviewsPlugin: Plugin<'reviews', ReviewsEndpoints> = {
  name: 'reviews' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    list: async ({ productId, limit = 5, pageParam = 1 }, headers) =>
      sdk.client.fetch(`/store/products/${productId}/reviews`, {
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
    add: async (input, headers) =>
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
