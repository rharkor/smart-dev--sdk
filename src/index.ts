import { defaultEndpoint } from "./lib/constants"
import { smartContracts } from "./smart-contracts"

/**
 * Creates and initializes an instance of the Smart Dev SDK.
 *
 * @param {object} params - Configuration options for the Smart Dev SDK.
 * @param {string} params.endpoint - The base URL for the Smart Dev API. If not provided, defaults to the value from `lib/constants`.
 * @param {string} params.apiKeyId - Your Smart Dev API key ID.
 * @param {string} params.apiKeySecret - Your Smart Dev API secret key.
 *
 * @returns {object} An object containing the initialized Smart Dev SDK instance.
 *
 * @example
 * ```typescript
 * import getSmartDev from '@smart-dev/sdk'
 *
 * const apiKeyId = 'YOUR_API_KEY_ID'
 * const apiKeySecret = 'YOUR_API_SECRET_KEY'
 *
 * const smartDev = getSmartDev({
 *   apiKeyId,
 *   apiKeySecret,
 * })
 *
 * // Use the smartDev object to interact with Smart Dev smart contracts
 * smartDev.smartContracts.callContractMethod(...)
 * ```
 */
const getSmartDev = (params: {
  endpoint?: string
  apiKeyId: string
  apiKeySecret: string
}): {
  smartContracts: ReturnType<typeof smartContracts>
} => {
  const endpoint = params.endpoint ?? defaultEndpoint
  return {
    smartContracts: smartContracts({
      endpoint,
      apiKeyId: params.apiKeyId,
      apiKeySecret: params.apiKeySecret,
    }),
  }
}

export default getSmartDev
