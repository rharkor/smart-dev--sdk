import { defaultEndpoint } from "./lib/constants"
import { pingEndpoint } from "./utils/endpoint"
import { smartContracts } from "./smart-contracts"

/**
 * Configuration options for the Smart Dev SDK.
 */
export interface IGetSmartDevParams {
  /**
   * Custom URL for the Smart Dev API (usefull for beta testing).
   */
  endpoint?: string

  /**
   * Your Smart Dev API key ID.
   */
  apiKeyId: string

  /**
   * Your Smart Dev API secret key.
   */
  apiKeySecret: string
}

/**
 * The Smart Dev SDK instance.
 */
export interface ISmartDev {
  /**
   * The Smart Contracts module.
   */
  smartContracts: ReturnType<typeof smartContracts>
}

/**
 * Creates and initializes an instance of the Smart Dev SDK.
 *
 * @param params - Configuration options for the Smart Dev SDK.
 *
 * @returns An object containing the Smart Dev SDK modules.
 *
 * @example
 * ```typescript
 * import getSmartDev from '@smart-dev/sdk'
 *
 * const apiKeyId = 'YOUR_API_KEY_ID'
 * const apiKeySecret = 'YOUR_API_SECRET_KEY'
 *
 * const smartDev = await getSmartDev({
 *   apiKeyId,
 *   apiKeySecret,
 * })
 * ```
 */
const getSmartDev = async (params: IGetSmartDevParams): Promise<ISmartDev> => {
  const endpoint = params.endpoint ?? defaultEndpoint

  if (!(await pingEndpoint(endpoint))) {
    throw new Error(`The Smart Dev API is not available at ${endpoint}`)
  }

  return {
    smartContracts: smartContracts({
      endpoint,
      apiKeyId: params.apiKeyId,
      apiKeySecret: params.apiKeySecret,
    }),
  }
}

export default getSmartDev
