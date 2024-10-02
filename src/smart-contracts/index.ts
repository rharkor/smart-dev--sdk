import { IApiMethodContext } from "../utils/context"

import { callContractMethod as _callContractMethod } from "./call-contract-method"
import { getAvailableNodeAddress as _getAvailableNodeAddress } from "./get-available-node-address"
import { getTransaction as _getTransaction } from "./get-transaction"

/**
 * Configuration options for the Smart Contracts module.
 */
export interface ISmartContractsOptions extends IApiMethodContext {}

export interface ISmartContracts {
  /**
   * Fetches a transaction.
   */
  getTransaction: ReturnType<typeof _getTransaction>

  /**
   * Calls a method on a smart contract.
   */
  callContractMethod: ReturnType<typeof _callContractMethod>

  /**
   * Fetches an available node from a pool.
   */
  getAvailableNodeAddress: ReturnType<typeof _getAvailableNodeAddress>
}

export const smartContracts = ({
  endpoint: _endpoint,
  apiKeyId,
  apiKeySecret,
}: ISmartContractsOptions): ISmartContracts => {
  // Remove trailing slash from the endpoint
  const endpoint = _endpoint.endsWith("/") ? _endpoint.slice(0, -1) : _endpoint

  const getTransaction = _getTransaction({ endpoint, apiKeyId, apiKeySecret })
  const callContractMethod = _callContractMethod({ endpoint, apiKeyId, apiKeySecret })
  const getAvailableNodeAddress = _getAvailableNodeAddress({ endpoint, apiKeyId, apiKeySecret })

  return {
    getTransaction,
    callContractMethod,
    getAvailableNodeAddress,
  }
}
