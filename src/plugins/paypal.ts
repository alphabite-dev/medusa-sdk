import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import { StoreCartAddress, StoreCartLineItem } from '@medusajs/types'

/**
 * Response containing PayPal client token for frontend integration
 */
export interface CreateClientTokenOutput {
  /** PayPal client token used for initializing PayPal SDK on frontend */
  client_token: string
}

/**
 * Payment session data structure for PayPal transactions
 */
export interface PaypalPaymentSessionInputData {
  /** Shipping address information */
  shipping_info?: StoreCartAddress
  /** Line items in the cart */
  items?: StoreCartLineItem[]
  /** Customer email address */
  email?: string
}

/**
 * Available PayPal plugin endpoints
 */
type PaypalEndpoints = {
  /** Creates a PayPal client token for frontend integration */
  createClientToken: (
    headers?: ClientHeaders,
  ) => Promise<CreateClientTokenOutput>
}

/**
 * PayPal payment integration plugin
 * Provides endpoints for PayPal payment processing
 */
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
