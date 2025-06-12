import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'

export interface PaypalClientToken {
  client_token: string
}

type PaypalEndpoints = {
  get_client_token: (headers?: ClientHeaders) => Promise<PaypalClientToken>
}

export const paypalPlugin: Plugin<'paypal', PaypalEndpoints> = {
  name: 'paypal' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    get_client_token: async (headers) =>
      sdk.client.fetch('/store/paypal/client-token', {
        method: 'POST',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
  }),
}
