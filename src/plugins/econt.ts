import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import type { City, Office, Quarter } from '@alphabite/econt-types'

/**
 * Supported country codes for Econt delivery service
 * Currently supports Bulgaria, can be extended with additional countries
 */
export type CountryCode = 'BGR'

/**
 * Input for listing cities in a country
 */
export interface ListCitiesInput {
  /**
   * ISO 3166-1 alpha-3 country code
   * @default "BGR"
   */
  countryCode?: CountryCode
}

/**
 * Response containing list of cities
 */
export interface ListCitiesOutput {
  /**
   * Array of cities with full details from Econt
   * Includes: id, name, nameEn, postCode, region, etc.
   */
  cities: City[]
}

/**
 * Input for listing quarters (neighborhoods) in a city
 */
export interface ListQuartersInput {
  /**
   * ISO 3166-1 alpha-3 country code
   * @default "BGR"
   */
  countryCode?: CountryCode
  /**
   * ID of the city to get quarters for
   * Required parameter
   */
  cityId: string
}

/**
 * Response containing list of quarters
 */
export interface ListQuartersOutput {
  /**
   * Array of quarters with details from Econt
   * Includes: id, cityID, name, nameEn
   */
  quarters: Quarter[]
}

/**
 * Input for listing Econt offices with optional filtering
 */
export interface ListOfficesInput {
  /**
   * ISO 3166-1 alpha-3 country code
   * @default "BGR"
   */
  countryCode?: CountryCode
  /**
   * ID of the city to filter offices by
   * At least cityId or officeCode should be provided
   */
  cityId?: string
  /**
   * Quarter name to filter offices by
   * Only works when cityId is also provided
   */
  quarter?: string
  /**
   * Specific office code to retrieve
   * Can be used alone or with cityId for faster filtering
   */
  officeCode?: string
}

/**
 * Response containing list of Econt offices
 */
export interface ListOfficesOutput {
  /**
   * Array of offices with full details from Econt
   * Includes: code, name, address, phones, workingHours, etc.
   */
  offices: Office[]
}

/**
 * Available Econt plugin endpoints
 */
type EcontEndpoints = {
  /**
   * Lists cities for a given country
   * Cities are cached and returned from Redis for fast responses
   */
  listCities: (
    input: ListCitiesInput,
    headers?: ClientHeaders,
  ) => Promise<ListCitiesOutput>
  /**
   * Lists quarters (neighborhoods) for a specific city
   * Quarters are cached per city for fast responses
   */
  listQuarters: (
    input: ListQuartersInput,
    headers?: ClientHeaders,
  ) => Promise<ListQuartersOutput>
  /**
   * Lists Econt offices with optional filtering
   * Supports filtering by city, quarter, or specific office code
   * All data is served from hierarchical cache for instant responses
   */
  listOffices: (
    input: ListOfficesInput,
    headers?: ClientHeaders,
  ) => Promise<ListOfficesOutput>
}

/**
 * Econt fulfillment provider plugin
 * Provides endpoints for fetching Econt delivery locations (cities, offices, quarters)
 * to enable customers to select pickup locations in the storefront
 */
export const econtPlugin: Plugin<'econt', EcontEndpoints> = {
  name: 'econt' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    listCities: async ({ countryCode = 'BGR' }, headers) =>
      sdk.client.fetch('/store/econt/cities', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { countryCode },
      }),
    listQuarters: async ({ cityId, countryCode = 'BGR' }, headers) =>
      sdk.client.fetch('/store/econt/quarters', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { cityId, countryCode },
      }),
    listOffices: async ({ countryCode = 'BGR', ...input }, headers) =>
      sdk.client.fetch('/store/econt/offices', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { countryCode, ...input },
      }),
  }),
}
