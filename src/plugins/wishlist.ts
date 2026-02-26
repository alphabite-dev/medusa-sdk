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
  name: string | null
}

export interface WishlistItem {
  id: string
  product_id: string
  product_variant_id: string
  wishlist_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  product_variant:
    | (Omit<BaseProductVariant, 'product'> & {
        product: Pick<BaseProduct, 'id' | 'thumbnail' | 'title' | 'handle'>
        prices: PriceDTO[]
        calculated_price?: {
          calculated_amount: number
          currency_code: string
        } | null
        availability?: number | null
      })
    | null
}

export interface CreateWishlistInput {
  name?: string
  sales_channel_id: string
}

export interface CreateWishlistOutput extends Wishlist {}

export interface ListWishlistsInput extends PaginatedInput {
  items_fields?: string[]
}

export interface ListWishlistsOutput extends PaginatedOutput<Wishlist> {}

export interface RetrieveWishlistInput {
  id: string
  items_fields?: string[]
  include_calculated_price?: boolean
  include_inventory_count?: boolean
}
export interface RetrieveWishlistOutput extends Wishlist {}

export interface UpdateWishlistInput {
  id: string
  name?: string
}

export interface UpdateWishlistOutput extends Omit<Wishlist, 'items'> {}

export interface DeleteWishlistInput {
  id: string
}

export interface DeleteWishlistOutput {
  id: string
}

export interface TotalItemsCountInput {
  wishlist_id?: string
}

export interface TotalItemsCountOutput {
  total_items_count: number
}

export interface TransferWishlistInput {
  id: string
}

export interface TransferWishlistOutput {
  id: string
}

export interface ShareWishlistInput {
  id: string
}

export interface ShareWishlistOutput {
  share_token: string
}

export interface ImportWishlistInput {
  share_token: string
}

export interface ImportWishlistOutput extends Wishlist {}

export interface AddItemToWishlistInput {
  product_variant_id: string
  id: string
}

export interface AddItemToWishlistOutput extends WishlistItem {}
export interface ListItemsInput extends PaginatedInput {
  id: string
}
export interface ListItemsOutput extends PaginatedOutput<WishlistItem> {}

export interface RemoveItemFromWishlistInput {
  wishlist_item_id: string
  id: string
}

export interface RemoveItemFromWishlistOutput {
  id: string
}

type WishlistEndpoints = {
  create: (
    input: CreateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<CreateWishlistOutput>
  list: (
    input: ListWishlistsInput,
    headers?: ClientHeaders,
  ) => Promise<ListWishlistsOutput>
  retrieve: (
    input: RetrieveWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RetrieveWishlistOutput>
  update: (
    input: UpdateWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<UpdateWishlistOutput>
  delete: (
    input: DeleteWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<DeleteWishlistOutput>
  transfer: (
    input: TransferWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<TransferWishlistOutput>
  share: (
    input: ShareWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<ShareWishlistOutput>
  import: (
    input: ImportWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<ImportWishlistOutput>
  totalItemsCount: (
    input: TotalItemsCountInput,
    headers?: ClientHeaders,
  ) => Promise<TotalItemsCountOutput>
  addItem: (
    input: AddItemToWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<AddItemToWishlistOutput>
  listItems: (
    input: ListItemsInput,
    headers?: ClientHeaders,
  ) => Promise<ListItemsOutput>
  removeItem: (
    input: RemoveItemFromWishlistInput,
    headers?: ClientHeaders,
  ) => Promise<RemoveItemFromWishlistOutput>
}

export const wishlistPlugin: Plugin<'wishlist', WishlistEndpoints> = {
  name: 'wishlist' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    create: async ({ ...input }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    list: async ({ limit = 10, offset = 0, ...input }, headers) =>
      sdk.client.fetch('/store/wishlists', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset, ...input },
      }),
    retrieve: async ({ id, ...input }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: input,
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
    transfer: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/transfer`, {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    share: async ({ id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/share`, {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    import: async (input, headers) =>
      sdk.client.fetch(`/store/wishlists/import`, {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    addItem: async ({ id, ...input }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/add-item`, {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    listItems: async ({ id, limit = 10, offset = 0, ...input }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/items`, {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { limit, offset, ...input },
      }),
    removeItem: async ({ wishlist_item_id, id }, headers) =>
      sdk.client.fetch(`/store/wishlists/${id}/items/${wishlist_item_id}`, {
        method: 'DELETE',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
