import smartDev from "../../index"

import { getSertApiKeyId, getSertApiKeySecret, getSertEndpoint } from "./store"

export const getSmartDev = async (params: { apiKeyId?: string; apiKeySecret?: string; endpoint?: string }) => {
  const apiKeyId = params.apiKeyId ?? (await getSertApiKeyId())
  const apiKeySecret = params.apiKeySecret ?? (await getSertApiKeySecret())
  const endpoint = params.endpoint ?? (await getSertEndpoint())

  const SmartDev = smartDev({
    apiKeyId,
    apiKeySecret,
    endpoint,
  })
  return SmartDev
}
