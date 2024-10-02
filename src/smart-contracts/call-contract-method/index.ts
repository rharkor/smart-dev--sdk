import { z } from "zod"

import {
  callContractMethodResponseSchema,
  callContractMethodSchema,
  getTransactionResponseSchema,
} from "@smart-dev/schemas/transactions"

import { IApiMethodContext } from "../../utils/context"
import { getTransaction } from "../get-transaction"

/**
 * Calls a method on a smart contract.
 */
export interface ICallContractMethod extends IApiMethodContext {}

/**
 * The parameters for the callContractMethod method.
 */
export type TCallContractMethodParams = z.infer<ReturnType<typeof callContractMethodSchema>>

/**
 * The parameters for the waitForTransactionToBeMined method.
 */
export interface IWaitForTransactionToBeMinedParams {
  /**
   * The interval in milliseconds to poll the transaction status.
   *
   * @default 3000
   */
  pollingInterval: number

  /**
   * The maximum time in milliseconds to wait for the transaction to be mined. If the transaction is not mined within this time, the function will throw an error.
   *
   * @default 600000 (10 minutes)
   */
  maxTimeout: number
}

/**
 * The result of the waitForTransactionToBeMined method.
 */
export type TWaitForTransactionToBeMinedResult = z.infer<ReturnType<typeof getTransactionResponseSchema>>["transaction"]

/**
 * Waits for the transaction to be mined.
 */
export type TWaitForTransactionToBeMined = (
  /**
   * The parameters for the waitForTransactionToBeMined method.
   */
  params?: IWaitForTransactionToBeMinedParams
) => Promise<TWaitForTransactionToBeMinedResult>

/**
 * The response object for the callContractMethod method.
 */
export interface ICallContractMethodResponse {
  /**
   * The response data. Please not that at this point the transaction is not mined yet.
   */
  data: z.infer<ReturnType<typeof callContractMethodResponseSchema>>

  /**
   * Waits for the transaction to be mined.
   */
  wait: TWaitForTransactionToBeMined
}

/**
 * Calls a method on a smart contract.
 */
export const callContractMethod =
  ({ apiKeyId, apiKeySecret, endpoint }: ICallContractMethod) =>
  async (params: TCallContractMethodParams): Promise<ICallContractMethodResponse> => {
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
    const wait = async (
      params: IWaitForTransactionToBeMinedParams = {
        pollingInterval: 3000,
        maxTimeout: 600000, //? 10 minutes
      }
    ) => {
      const pollingInterval = params.pollingInterval
      const start = Date.now()
      // Start polling the transaction status
      while (Date.now() - start < params.maxTimeout) {
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
