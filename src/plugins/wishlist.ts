import { BaseProduct } from '@medusajs/types/dist/http/product/common'
import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'

export interface WishlistOutput {
  wishlist: {
    id: string
    customer_id: string
    sales_channel_id: string
    items: WishlistItem[]
    created_at: string
    updated_at: string
  }
}

export interface WishlistItem {
  id: string
  product_id: string
  wishlist_id: string
  created_at: string
  updated_at: string
  variants: BaseProduct['variants']
  product: BaseProduct
}

type WishlistEndpoints = {
  list: (headers?: ClientHeaders) => Promise<WishlistOutput>
  add: (productId: string, headers?: ClientHeaders) => Promise<WishlistOutput>
  remove: (
    productId: string,
    headers?: ClientHeaders,
  ) => Promise<WishlistOutput>
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    list: async (headers) =>
      sdk.client.fetch('/store/customers/me/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    add: async (productId, headers) =>
      sdk.client.fetch('/store/customers/me/wishlists/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    remove: async (productId, headers) =>
      sdk.client.fetch(`/store/customers/me/wishlists/items/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
