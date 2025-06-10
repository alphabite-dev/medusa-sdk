import { BaseProduct } from '@medusajs/types/dist/http/product/common'
import { Client } from '@medusajs/js-sdk'
import { AlphabiteClientOptions } from '..'

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
  list: () => Promise<WishlistOutput>
  add: (productId: string) => Promise<WishlistOutput>
  remove: (productId: string) => Promise<WishlistOutput>
}

type Plugin<Name extends string, Endpoints> = {
  name: Name
  endpoints: (client: Client, options?: AlphabiteClientOptions) => Endpoints
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (client: Client, options?: AlphabiteClientOptions) => ({
    list: async () =>
      client.fetch('/store/customers/me/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
        },
      }),
    add: async (productId: string) =>
      client.fetch('/store/customers/me/wishlists/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
        headers: {
          ...(await options?.getAuthHeader?.()),
        },
      }),
    remove: async (productId: string) =>
      client.fetch(`/store/customers/me/wishlists/items/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
        },
      }),
  }),
}
