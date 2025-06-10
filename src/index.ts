// Options type for extensibility
export type AlphabiteClientOptions = {
  getAuthHeader?: () => Promise<Record<string, string>> | Record<string, string>
}

// Generic plugin type definition
export type Plugin<Name extends string, Endpoints> = {
  name: Name
  endpoints: (client: any, options?: AlphabiteClientOptions) => Endpoints
}

// Utility type to map plugins to their endpoints
export type PluginsToAlphabite<T extends readonly Plugin<any, any>[]> = {
  [K in T[number] as K['name']]: ReturnType<K['endpoints']>
}

// The extensible client class
export class AlphabiteMedusaClient<
  TPlugins extends readonly Plugin<any, any>[],
  TBaseClient extends { fetch: (...args: any[]) => any },
> {
  public alphabite: PluginsToAlphabite<TPlugins>
  protected client: TBaseClient
  protected options?: AlphabiteClientOptions

  constructor(
    baseClient: TBaseClient,
    plugins: TPlugins,
    options?: AlphabiteClientOptions,
  ) {
    this.client = baseClient
    this.options = options
    const endpoints: any = {}
    plugins.forEach((plugin) => {
      endpoints[plugin.name] = plugin.endpoints(this.client, this.options)
    })
    this.alphabite = endpoints
  }
}
