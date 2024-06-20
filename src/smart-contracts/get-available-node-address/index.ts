import { z } from "zod"

import { getAvailableNodeAddressResponseSchema, getAvailableNodeAddressSchema } from "@smart-dev/schemas/transactions"

export const getAvailableNodeAddress =
  ({ apiKeyId, apiKeySecret, endpoint }: { endpoint: string; apiKeyId: string; apiKeySecret: string }) =>
  async (
    params: z.infer<ReturnType<typeof getAvailableNodeAddressSchema>>
  ): Promise<z.infer<ReturnType<typeof getAvailableNodeAddressResponseSchema>>> => {
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
