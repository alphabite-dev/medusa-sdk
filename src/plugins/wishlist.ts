import { BaseProduct } from '@medusajs/types/dist/http/product/common'
import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'

export interface Wishlist {
  id: string
  customer_id: string
  sales_channel_id: string
  items: WishlistItem[]
  created_at: string
  updated_at: string
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

export interface ListWishlistOutput {
  wishlist: Wishlist
  // wishlists: Wishlist[]
}

export interface AddItemToWishlistInput {
  productId: string
  // wishlistId:string;
}

export interface AddItemToWishlistOutput {
  wishlist: Wishlist
}

export interface RemoveItemToWishlistInput {
  productId: string
  // wishlistId:string;
}

export interface RemoveItemToWishlistOutput {
  wishlist: Wishlist
}

//TODO: endpoint for get wishlist by id
// create wishlist endpoint
// delete wishlist endpoint

type WishlistEndpoints = {
  list: (headers?: ClientHeaders) => Promise<ListWishlistOutput>
  addItem: (
    input: AddItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<AddItemToWishlistOutput>
  removeItem: (
    input: RemoveItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RemoveItemToWishlistOutput>
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
    addItem: async ({ productId }, headers) =>
      sdk.client.fetch('/store/customers/me/wishlists/items', {
        method: 'POST',
        body: { product_id: productId },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    removeItem: async ({ productId }, headers) =>
      sdk.client.fetch(`/store/customers/me/wishlists/items/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
