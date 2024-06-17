import { z } from "zod"

import {
  callContractMethodResponseSchema,
  callContractMethodSchema,
  getTransactionResponseSchema,
  getTransactionSchema,
} from "@smart-dev/schemas/transactions"

export const smartContracts = ({
  endpoint: _endpoint,
  apiKeyId,
  apiKeySecret,
}: {
  endpoint: string
  apiKeyId: string
  apiKeySecret: string
}) => {
  const endpoint = _endpoint.endsWith("/") ? _endpoint.slice(0, -1) : _endpoint

  /**
   * Fetches a transaction by its ID from the Smart Dev API.
   *
   * @param {object} params - Transaction details.
   * @param {string} params.id - The unique identifier of the transaction to retrieve.
   *
   * @returns {Promise<object>} A promise that resolves to the fetched transaction object.
   *
   * @example
   * ```javascript
   * smartContracts.getTransaction({ id: 'clxi9...' })
   *   .then(transaction => {
   *     console.log('Transaction details:', transaction)
   *   })
   *   .catch(error => {
   *     console.error('Failed to get transaction:', error)
   *   })
   * ```
   */
  const getTransaction = async (
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

  /**
   * Calls a method on a smart contract deployed on the Smart Dev network.
   *
   * @param {object} params - Call contract method details.
   *
   * @returns {Promise<object>} A promise that resolves to an object with call data and a function to wait for transaction mining.
   * @property {object} data - Parsed response data containing details about the method call, including the transaction ID.
   * @property {function} wait - A function that waits for the transaction to be mined and returns the full transaction object upon success. You can optionally provide a configuration object to customize the polling interval.
   *
   * @example
   * ```javascript
   * smartContracts.callContractMethod({
   *   poolId: 'ci87...',
   *   encryptionKey: '****',
   *   smartContractId: 'cr4j...',
   *   method: 'myMethod()',
   * })
   *   .then(response => {
   *     console.log('Call data:', response.data)
   *     response.wait().then(transaction => {
   *       console.log('Mined transaction:', transaction)
   *     })
   *   })
   *   .catch(error => {
   *     console.error('Failed to call contract method:', error)
   *   })
   * ```
   */
  const callContractMethod = async (
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
        const transaction = await getTransaction({ id: transactionId })
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

  return {
    getTransaction,
    callContractMethod,
  }
}
