import Medusa from '@medusajs/js-sdk'
export * from './plugins'

/**
 * Configuration options for Alphabite client functionality
 */
export type AlphabiteClientOptions = {
  /** Function to retrieve authentication headers (sync or async) */
  getAuthHeader?: () => Promise<Record<string, string>> | Record<string, string>
}

/**
 * Medusa configuration type extracted from the Medusa SDK constructor
 */
export type AlphabiteMedusaConfig = ConstructorParameters<typeof Medusa>[0]

/**
 * Plugin definition structure for extending the SDK with custom endpoints
 * @template Name - Unique string identifier for the plugin
 * @template Endpoints - Type definition for the plugin's endpoint methods
 */
export type Plugin<Name extends string, Endpoints> = {
  /** Unique identifier for the plugin namespace */
  name: Name
  /** Function that returns the plugin's endpoint implementations */
  endpoints: (
    client: any,
    options?: AlphabiteClientOptions,
    medusaConfig?: AlphabiteMedusaConfig,
  ) => Endpoints
}

/**
 * Transforms an array of plugins into a typed object with plugin names as keys
 * @template T - Array of plugin definitions
 */
export type PluginsToAlphabite<T extends readonly Plugin<any, any>[]> = {
  [K in T[number] as K['name']]: ReturnType<K['endpoints']>
}

/**
 * Extended Medusa SDK with support for custom plugin endpoints
 * Provides a modular way to add plugin-specific API methods while maintaining
 * full compatibility with the base Medusa SDK functionality
 *
 * @template TPlugins - Array of plugin definitions to integrate
 * @template TOptions - Client options configuration type
 *
 * @example
 * ```typescript
 * const sdk = new AlphabiteMedusaSdk(
 *   { baseUrl: 'https://api.example.com', publishableKey: 'pk_...' },
 *   [wishlistPlugin, reviewsPlugin, paypalPlugin],
 *   { getAuthHeader: async () => ({ Authorization: 'Bearer token' }) }
 * )
 *
 * // Access plugin endpoints
 * const wishlist = await sdk.alphabite.wishlist.create({ sales_channel_id: 'sc_123' })
 * const reviews = await sdk.alphabite.reviews.list({ product_ids: ['prod_123'] })
 * ```
 */
export class AlphabiteMedusaSdk<
  TPlugins extends readonly Plugin<any, any>[],
  TOptions extends AlphabiteClientOptions = AlphabiteClientOptions,
> extends Medusa {
  /** Object containing all plugin endpoints, keyed by plugin name */
  public alphabite: PluginsToAlphabite<TPlugins>
  /** Client configuration options */
  protected options?: TOptions
  /** Medusa configuration passed to the constructor */
  public medusaConfig: AlphabiteMedusaConfig

  /**
   * Creates a new instance of the Alphabite Medusa SDK
   * @param medusaOptions - Configuration for the base Medusa SDK
   * @param plugins - Array of plugin definitions to integrate
   * @param options - Optional client configuration (e.g., auth headers)
   */
  constructor(
    medusaOptions: AlphabiteMedusaConfig,
    plugins: TPlugins,
    options?: TOptions,
  ) {
    super(medusaOptions)
    this.options = options
    this.medusaConfig = medusaOptions

    const endpoints: any = {}
    plugins.forEach((plugin) => {
      endpoints[plugin.name] = plugin.endpoints(
        this,
        this.options,
        this.medusaConfig,
      )
    })
    this.alphabite = endpoints
  }
}
