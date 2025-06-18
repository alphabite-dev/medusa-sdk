import {
  BaseProduct,
  BaseProductVariant,
} from '@medusajs/types/dist/http/product/common'
import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { PaginatedInput, PaginatedOutput } from './types'
import { PriceDTO } from '@medusajs/types'

export interface Wishlist {
  id: string
  customer_id: string | null
  sales_channel_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  items: WishlistItem[]
}

export interface WishlistItem {
  id: string
  product_id: string
  wishlist_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  product_variant:
    | (Omit<BaseProductVariant, 'product'> & {
        product: Pick<BaseProduct, 'id' | 'thumbnail'>
        prices: PriceDTO[]
      })
    | null
}

//No input for ListWishlist

export interface ListWishlistsInput extends PaginatedInput {}

//Currently list wishlist route  return wishlist items without product field
export interface ListWishlistsOutput extends PaginatedOutput<Wishlist> {
  //List many wishlists
}

export interface AddItemToWishlistInput {
  product_variant_id: string
  id: string
}

export interface AddItemToWishlistOutput extends WishlistItem {}

export interface RemoveItemFromWishlistInput {
  wishlist_item_id: string
  id: string
}

export interface RemoveItemFromWishlistOutput {
  id: string
}

export interface CreateWishlistInput {
  name?: string
  sales_channel_id: string
}

export interface CreateWishlistOutput extends Wishlist {}

export interface TransferWishlistInput {
  id: string
}

export interface TransferWishlistOutput {
  id: string
}

export interface RetrieveWishlistInput {
  id: string
}

export interface RetrieveWishlistOutput extends Wishlist {}

export interface DeleteWishlistInput {
  id: string
}

export interface DeleteWishlistOutput {
  id: string
}

export interface UpdateWishlistInput {
  id: string
  name?: string
}

export interface UpdateWishlistOutput extends Omit<Wishlist, 'items'> {}

export interface ListItemsInput extends PaginatedInput {
  id: string
}

export interface ListItemsOutput extends PaginatedOutput<WishlistItem> {}

//TODO:
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
    input: RemoveItemFromWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RemoveItemFromWishlistOutput>
  create: (
    input: CreateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<CreateWishlistOutput>
  transfer: (
    input: TransferWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<TransferWishlistOutput>
  retrieve: (
    input: RetrieveWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RetrieveWishlistOutput>
  delete: (
    input: DeleteWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<DeleteWishlistOutput>
  update: (
    input: UpdateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<UpdateWishlistOutput>
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    list: async ({ limit = 10, offset = 0, order, fields }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset, order, fields },
      }),
    listItems: async ({ id, limit = 10, offset = 0, fields, order }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/items`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset, order, fields },
      }),
    addItem: async ({ product_variant_id, id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/add-item`, {
        method: 'POST',
        body: { product_variant_id },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    removeItem: async ({ wishlist_item_id, id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/items/${wishlist_item_id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    create: async ({ name, sales_channel_id }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'POST',
        body: { name, sales_channel_id },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    transfer: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/transfer`, {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    retrieve: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    delete: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    update: async ({ id, ...input }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}`, {
        method: 'PUT',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
