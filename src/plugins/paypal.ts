import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { StoreCartAddress, StoreCartLineItem } from '@medusajs/types'

export interface CreateClientTokenOutput {
  client_token: string
}

export interface PaypalPaymentSessionInputData {
  shipping_info?: StoreCartAddress
  items?: StoreCartLineItem[]
  email?: string
}

type PaypalEndpoints = {
  createClientToken: (
    headers?: ClientHeaders,
  ) => Promise<CreateClientTokenOutput>
}

export const paypalPlugin: Plugin<'paypal', PaypalEndpoints> = {
  name: 'paypal' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    createClientToken: async (headers) =>
      sdk.client.fetch('/store/paypal/client-token', {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
