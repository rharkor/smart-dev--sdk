import { Command } from "commander"

import { registerCallContractMethod } from "./call-contract-method"
import { registerGetTransaction } from "./get-transaction"

export const registerSmartContracts = (program: Command) => {
  //* SMART CONTRACTS
  const smartContractsCommand = new Command("smart-contracts").description("Interact with smart contracts")
  registerGetTransaction(smartContractsCommand)
  registerCallContractMethod(smartContractsCommand)
  program.addCommand(smartContractsCommand)
}
