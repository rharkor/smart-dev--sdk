import { z } from "zod"

import {
  callContractMethodResponseSchema,
  callContractMethodSchema,
  getTransactionResponseSchema,
} from "@smart-dev/schemas/transactions"

import { getTransaction } from "../get-transaction"

export const callContractMethod =
  ({ apiKeyId, apiKeySecret, endpoint }: { endpoint: string; apiKeyId: string; apiKeySecret: string }) =>
  async (
    params: z.infer<ReturnType<typeof callContractMethodSchema>>
  ): Promise<{
    data: z.infer<ReturnType<typeof callContractMethodResponseSchema>>
    wait: (params?: {
      pollingInterval?: number
    }) => Promise<z.infer<ReturnType<typeof getTransactionResponseSchema>>["transaction"]>
  }> => {
    const res = await fetch(`${endpoint}/api/transactions/call-contract-method`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key-id": apiKeyId,
        "x-api-key-secret": apiKeySecret,
      },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to call contract method (${res.status}): ${text}`)
    }
    const resJson = await res.json()
    const parsed = callContractMethodResponseSchema().safeParse(resJson)
    if (!parsed.success) {
      throw new Error(`Failed to parse response: ${parsed.error}`)
    }

    //* Wait to be mined
    const wait = async (params?: { pollingInterval?: number }) => {
      const pollingInterval = params?.pollingInterval ?? 3000
      const start = Date.now()
      //? Max timeout 5 minutes
      const timeout = 1000 * 60 * 5
      while (Date.now() - start < timeout) {
        const { transactionId } = parsed.data.meta
        const transaction = await getTransaction({ apiKeyId, apiKeySecret, endpoint })({ id: transactionId })
        if (transaction.status === "SUCCESS") {
          return transaction
        }
        if (transaction.status === "FAILED") {
          throw new Error("Transaction failed")
        }
        await new Promise<void>((resolve) => setTimeout(resolve, pollingInterval))
      }
      throw new Error("Timeout")
    }

    return {
      data: parsed.data,
      wait,
    }
  }
