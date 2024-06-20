import { z } from "zod"

import { getTransactionResponseSchema, getTransactionSchema } from "@smart-dev/schemas/transactions"

export const getTransaction =
  ({ apiKeyId, apiKeySecret, endpoint }: { endpoint: string; apiKeyId: string; apiKeySecret: string }) =>
  async (
    params: z.infer<ReturnType<typeof getTransactionSchema>>
  ): Promise<z.infer<ReturnType<typeof getTransactionResponseSchema>>["transaction"]> => {
    const res = await fetch(`${endpoint}/api/transactions/${params.id}`, {
      headers: {
        "x-api-key-id": apiKeyId,
        "x-api-key-secret": apiKeySecret,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to get transaction (${res.status}): ${text}`)
    }
    const resJson = await res.json()
    const parsed = getTransactionResponseSchema().safeParse(resJson)
    if (!parsed.success) {
      throw new Error(`Failed to parse response: ${parsed.error}`)
    }
    return parsed.data.transaction
  }
