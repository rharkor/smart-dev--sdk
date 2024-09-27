import { z } from "zod"

import { getTransactionResponseSchema, getTransactionSchema } from "@smart-dev/schemas/transactions"

import { IApiMethodContext } from "../../utils/context"

/**
 * Fetches a transaction from the Smart Dev API.
 */
export interface IGetTransactionInitParams extends IApiMethodContext {}

/**
 * The parameters for the getTransaction method.
 */
export interface IGetTransactionParams extends z.infer<ReturnType<typeof getTransactionSchema>> {
  /**
   * The transaction ID.
   */
  id: string
}

export type TTransaction = z.infer<ReturnType<typeof getTransactionResponseSchema>>["transaction"]

/**
 * The response object for the getTransaction method.
 */
export interface IGetTransactionResponse extends TTransaction {}

export const getTransaction =
  ({ apiKeyId, apiKeySecret, endpoint }: IGetTransactionInitParams) =>
  async (params: IGetTransactionParams): Promise<IGetTransactionResponse> => {
    // Fetch the transaction from the Smart Dev API.
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
