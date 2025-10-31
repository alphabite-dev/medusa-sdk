import Medusa, { ClientHeaders } from '@medusajs/js-sdk'
import { AlphabiteClientOptions, Plugin } from '..'
import type { City, Office, Quarter } from '@alphabite/econt-types'

/**
 * Supported country codes for Econt delivery service
 * Currently supports Bulgaria, can be extended with additional countries
 */
export type CountryCode = 'BGR'

/**
 * Address city information for validation
 */
export interface ValidateAddressCity {
  /**
   * Country code object with ISO 3166-1 alpha-2 code
   */
  country: {
    code2: string
  }
  /**
   * City name
   */
  name: string
}

/**
 * Input address for validation
 */
export interface ValidateAddressInputAddress {
  /**
   * City object with country code and name (required)
   */
  city: ValidateAddressCity
  /**
   * Street name (optional)
   */
  street?: string
  /**
   * Street number (optional)
   */
  num?: string
  /**
   * Quarter/district name (optional)
   */
  quarter?: string
  /**
   * Additional address details (optional)
   */
  other?: string
}

/**
 * Input for validating an address using Econt's address validation service
 */
export interface ValidateAddressInput {
  /**
   * Address to validate (city, street, num required)
   */
  address: ValidateAddressInputAddress
}

/**
 * Location coordinates from address validation
 */
export interface ValidateAddressLocation {
  /**
   * Latitude coordinate
   */
  latitude: number
  /**
   * Longitude coordinate
   */
  longitude: number
  /**
   * Confidence level (1-5)
   */
  confidence: number
}

/**
 * Validated address structure returned from validation
 */
export interface ValidatedAddress {
  /**
   * Validated city with full details (includes id, name, etc.)
   */
  city: City
  /**
   * Full formatted address string
   */
  fullAddress: string
  /**
   * Validated street name
   */
  street?: string
  /**
   * Validated street number
   */
  num?: string
  /**
   * Location coordinates if available
   */
  location?: ValidateAddressLocation
}

/**
 * Response containing validated address and validation status
 */
export interface ValidateAddressOutput {
  /**
   * Validated address with full details
   */
  address: ValidatedAddress
  /**
   * Validation status: "normal" (valid and found), "processed" (modified for validation), "invalid" (could not be validated)
   */
  validationStatus: 'normal' | 'processed' | 'invalid'
}

/**
 * Input for listing cities in a country
 */
export interface ListCitiesInput {
  /**
   * ISO 3166-1 alpha-3 country code
   * @default "BGR"
   */
  countryCode?: CountryCode
  /**
   * Search query to filter cities by name or nameEn
   */
  q?: string
  /**
   * Comma-separated list of fields to include
   */
  fields?: string
  /**
   * Maximum number of results (1-100, default: 15)
   */
  limit?: number
  /**
   * Number of results to skip (default: 0)
   */
  offset?: number
  /**
   * Sort order (e.g., "name", "-name" for descending)
   */
  order?: string
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
  /**
   * Search query to filter quarters by name or nameEn
   */
  q?: string
  /**
   * Comma-separated list of fields to include
   */
  fields?: string
  /**
   * Maximum number of results (1-100, default: 15)
   */
  limit?: number
  /**
   * Number of results to skip (default: 0)
   */
  offset?: number
  /**
   * Sort order (e.g., "name", "-name" for descending)
   */
  order?: string
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
   * ID of the quarter to filter offices by
   */
  quarterId?: string
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
  /**
   * Search query to filter offices by name or nameEn
   */
  q?: string
  /**
   * Comma-separated list of fields to include
   */
  fields?: string
  /**
   * Maximum number of results (1-100, default: 15)
   */
  limit?: number
  /**
   * Number of results to skip (default: 0)
   */
  offset?: number
  /**
   * Sort order (e.g., "name", "-name" for descending)
   */
  order?: string
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
   * Validates an address using Econt's address validation service
   * Returns validated address with full details and validation status
   */
  validateAddress: (
    input: ValidateAddressInput,
    headers?: ClientHeaders,
  ) => Promise<ValidateAddressOutput>
  /**
   * Lists cities for a given country with optional filtering and pagination
   * Cities are cached and returned from Redis for fast responses
   */
  listCities: (
    input: ListCitiesInput,
    headers?: ClientHeaders,
  ) => Promise<ListCitiesOutput>
  /**
   * Lists quarters (neighborhoods) for a specific city with optional filtering and pagination
   * Quarters are cached per city for fast responses
   */
  listQuarters: (
    input: ListQuartersInput,
    headers?: ClientHeaders,
  ) => Promise<ListQuartersOutput>
  /**
   * Lists Econt offices with optional filtering and pagination
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
 * Provides endpoints for address validation and fetching Econt delivery locations (cities, offices, quarters)
 * to enable customers to validate addresses and select pickup locations in the storefront
 */
export const econtPlugin: Plugin<'econt', EcontEndpoints> = {
  name: 'econt' as const,
  endpoints: (sdk: Medusa, options?: AlphabiteClientOptions) => ({
    validateAddress: async (input, headers) =>
      sdk.client.fetch('/store/econt/validate-address', {
        method: 'POST',
        body: input,
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
      }),
    listCities: async ({ countryCode = 'BGR', ...query }, headers) =>
      sdk.client.fetch('/store/econt/cities', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { countryCode, ...query },
      }),
    listQuarters: async ({ cityId, countryCode = 'BGR', ...query }, headers) =>
      sdk.client.fetch('/store/econt/quarters', {
        method: 'GET',
        headers: {
          ...(await options?.getAuthHeader?.()),
          ...headers,
        },
        query: { cityId, countryCode, ...query },
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
