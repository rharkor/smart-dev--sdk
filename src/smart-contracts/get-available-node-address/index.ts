import { z } from "zod"

import { getAvailableNodeAddressResponseSchema, getAvailableNodeAddressSchema } from "@smart-dev/schemas/transactions"

import { IApiMethodContext } from "../../utils/context"

/**
 * Fetches an available node address from a pool.
 */
export interface IGetAvailableNodeAddress extends IApiMethodContext {}

/**
 * Fetches an available node address from a pool.
 */
export interface IGetAvailableNodeAddressParams extends z.infer<ReturnType<typeof getAvailableNodeAddressSchema>> {}

/**
 * The response object for the getAvailableNodeAddress method.
 */
export interface IGetAvailableNodeAddressResponse
  extends z.infer<ReturnType<typeof getAvailableNodeAddressResponseSchema>> {}

export const getAvailableNodeAddress =
  ({ apiKeyId, apiKeySecret, endpoint }: IGetAvailableNodeAddress) =>
  async (params: IGetAvailableNodeAddressParams): Promise<IGetAvailableNodeAddressResponse> => {
    const res = await fetch(`${endpoint}/api/transactions/get-available-node-address`, {
      method: "POST",
      headers: {
        "x-api-key-id": apiKeyId,
        "x-api-key-secret": apiKeySecret,
      },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to get available node (${res.status}): ${text}`)
    }
    const resJson = await res.json()
    const parsed = getAvailableNodeAddressResponseSchema().safeParse(resJson)
    if (!parsed.success) {
      throw new Error(`Failed to parse response: ${parsed.error}`)
    }
    return parsed.data
  }
