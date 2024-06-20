import { callContractMethod as _callContractMethod } from "./call-contract-method"
import { getAvailableNodeAddress as _getAvailableNodeAddress } from "./get-available-node-address"
import { getTransaction as _getTransaction } from "./get-transaction"

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
  const getTransaction = _getTransaction({ endpoint, apiKeyId, apiKeySecret })

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
  const callContractMethod = _callContractMethod({ endpoint, apiKeyId, apiKeySecret })

  /**
   * Fetches an available node from the Smart Dev API.
   *
   * @param {object} params - Node details.
   *
   * @returns {Promise<object>} A promise that resolves to the fetched node object.
   */
  const getAvailableNodeAddress = _getAvailableNodeAddress({ endpoint, apiKeyId, apiKeySecret })

  return {
    getTransaction,
    callContractMethod,
    getAvailableNodeAddress,
  }
}
