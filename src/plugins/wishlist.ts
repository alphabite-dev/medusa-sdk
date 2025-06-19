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
  items_count: number
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

//----CREATE
export interface CreateWishlistInput {
  name?: string
  sales_channel_id: string
}

export interface CreateWishlistOutput extends Wishlist {}

export interface AddItemToWishlistInput {
  product_variant_id: string
  id: string
}

export interface AddItemToWishlistOutput extends WishlistItem {}

//----READ
export interface ListWishlistsInput extends PaginatedInput {
  items_fields?: string[]
}

//Currently list wishlist route  return wishlist items without product field
export interface ListWishlistsOutput extends PaginatedOutput<Wishlist> {
  //List many wishlists
}
export interface RetrieveWishlistInput {
  id: string
  items_fields?: string[]
}
export interface RetrieveWishlistOutput extends Wishlist {}
export interface ListItemsInput extends PaginatedInput {
  id: string
}
export interface ListItemsOutput extends PaginatedOutput<WishlistItem> {}

export interface TotalItemsCountInput {
  wishlist_id?: string
}

export interface TotalItemsCountOutput {
  total_items_count: number
}

//----UPDATE
export interface TransferWishlistInput {
  id: string
}

export interface TransferWishlistOutput {
  id: string
}

export interface UpdateWishlistInput {
  id: string
  name?: string
}

export interface UpdateWishlistOutput extends Omit<Wishlist, 'items'> {}

//----DELETE
export interface RemoveItemFromWishlistInput {
  wishlist_item_id: string
  id: string
}

export interface RemoveItemFromWishlistOutput {
  id: string
}

export interface DeleteWishlistInput {
  id: string
}

export interface DeleteWishlistOutput {
  id: string
}

type WishlistEndpoints = {
  create: (
    input: CreateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<CreateWishlistOutput>
  addItem: (
    input: AddItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<AddItemToWishlistOutput>
  list: (
    input: ListWishlistsInput,
    headers?: ClientHeaders,
  ) => Promise<ListWishlistsOutput>
  listItems: (
    input: ListItemsInput,
    headers?: ClientHeaders,
  ) => Promise<ListItemsOutput>
  retrieve: (
    input: RetrieveWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RetrieveWishlistOutput>
  transfer: (
    input: TransferWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<TransferWishlistOutput>
  update: (
    input: UpdateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<UpdateWishlistOutput>
  delete: (
    input: DeleteWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<DeleteWishlistOutput>
  removeItem: (
    input: RemoveItemFromWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RemoveItemFromWishlistOutput>
  totalItemsCount: (
    input: TotalItemsCountInput,
    headers?: ClientHeaders,
  ) => Promise<TotalItemsCountOutput>
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    create: async ({ name, sales_channel_id }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'POST',
        body: { name, sales_channel_id },
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
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
    list: async (
      { limit = 10, offset = 0, order, fields, items_fields },
      headers,
    ) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset, order, fields, items_fields },
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
    retrieve: async ({ id, items_fields }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { items_fields },
      }),
    transfer: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/transfer`, {
        method: 'POST',
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
    removeItem: async ({ wishlist_item_id, id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/items/${wishlist_item_id}`, {
        method: 'DELETE',
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
    totalItemsCount: async ({ wishlist_id }, headers) =>
      sdk.client.fetch(`store/wishlists/total-items-count`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { wishlist_id },
      }),
  }),
}
