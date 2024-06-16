import { defaultEndpoint } from "./lib/constants"
import { smartContracts } from "./smart-contracts"

const getSmartDev = (params: { endpoint?: string; apiKeyId: string; apiKeySecret: string }) => {
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
