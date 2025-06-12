import { BaseProduct } from '@medusajs/types/dist/http/product/common'
import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { PaginatedInput, PaginatedOutput } from './types'

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

//No input for ListWishlist

export interface ListWishlistsInput extends PaginatedInput {}

export interface ListWishlistsOutput extends PaginatedOutput<Wishlist> {
  //List many wishlists
}

export interface AddItemToWishlistInput {
  product_id: string
  wishlist_id: string
}

export interface AddItemToWishlistOutput extends Wishlist {}

export interface RemoveItemToWishlistInput {
  product_id: string
  wishlist_id: string
}

export interface RemoveItemToWishlistOutput extends Wishlist {}

export interface CreateWishlistInput {
  name: string
}

export interface CreateWishlistOutput extends Wishlist {}

export interface TransferWishlistInput {
  wishlist_id: string
}

export interface RetrieveWishlistInput {
  wishlist_id: string
}

export interface RetrieveWishlistOutput extends Wishlist {}

export interface DeleteWishlistInput {
  wishlist_id: string
}

export interface UpdateWishlistInput {
  wishlist_id: string
  name?: string
}

export interface UpdateWishlistOutput extends Wishlist {}

export interface ListItemsInput extends PaginatedInput {
  wishlist_id: string
}

export interface ListItemsOutput extends PaginatedOutput<WishlistItem> {}

//TODO:
// retrieve - endpoint for get wishlist by id
// list - endpoint for list all wishlists
// create wishlist endpoint
// delete wishlist endpoint
//update wishlist endpoint
//another endpoint for guest user create and get - save id inside cookie

type WishlistEndpoints = {
  list: (
    input: ListWishlistsInput,
    headers?: ClientHeaders,
  ) => Promise<ListWishlistsOutput>
  listItems: (
    input: ListItemsInput,
    headers?: ClientHeaders,
  ) => Promise<ListItemsOutput>
  addItem: (
    input: AddItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<AddItemToWishlistOutput>
  removeItem: (
    input: RemoveItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RemoveItemToWishlistOutput>
  create: (
    input: CreateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<CreateWishlistOutput>
  transfer: (
    input: TransferWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<void>
  retrieve: (
    input: RetrieveWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RetrieveWishlistOutput>
  delete: (input: DeleteWishlistInput, headers?: ClientHeaders) => Promise<void>
  update: (
    input: UpdateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<UpdateWishlistOutput>
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    list: async ({ limit = 10, offset = 0 }, headers) =>
      sdk.client.fetch('/store/customers/me/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset },
      }),
    listItems: async ({ wishlist_id, limit = 10, offset = 0 }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}/items`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset },
      }),
    addItem: async ({ product_id, wishlist_id }, headers) =>
      sdk.client.fetch('/store/wishlists/items', {
        method: 'POST',
        body: { product_id, wishlist_id },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    removeItem: async ({ product_id, wishlist_id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}/items/${product_id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    create: async ({ name }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'POST',
        body: { name },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    transfer: async ({ wishlist_id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}/transfer`, {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    retrieve: async ({ wishlist_id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    delete: async ({ wishlist_id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    update: async ({ wishlist_id, ...input }, headers) =>
      sdk.client.fetch(`/store/wishlists/${wishlist_id}`, {
        method: 'PUT',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
