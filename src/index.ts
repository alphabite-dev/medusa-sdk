import Medusa from '@medusajs/js-sdk'
export * from './plugins'

export type AlphabiteClientOptions = {
  getAuthHeader?: () => Promise<Record<string, string>> | Record<string, string>
}

export type Plugin<Name extends string, Endpoints> = {
  name: Name
  endpoints: (client: any, options?: AlphabiteClientOptions) => Endpoints
}

export type PluginsToAlphabite<T extends readonly Plugin<any, any>[]> = {
  [K in T[number] as K['name']]: ReturnType<K['endpoints']>
}

export class AlphabiteMedusaSdk<
  TPlugins extends readonly Plugin<any, any>[],
  TOptions extends AlphabiteClientOptions = AlphabiteClientOptions,
> extends Medusa {
  public alphabite: PluginsToAlphabite<TPlugins>
  protected options?: TOptions

  constructor(
    medusaOptions: ConstructorParameters<typeof Medusa>[0],
    plugins: TPlugins,
    options?: TOptions,
  ) {
    super(medusaOptions)
    this.options = options
    const endpoints: any = {}
    plugins.forEach((plugin) => {
      endpoints[plugin.name] = plugin.endpoints(this, this.options)
    })
    this.alphabite = endpoints
  }
}
