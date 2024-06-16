import { Command, Option } from "commander"

import { getSmartDev } from "../../lib/cli-utils"
import { logger } from "../../lib/logger"
import { defaultOptions } from "../utils"

export const registerGetTransaction = (smartContractsCommand: Command) => {
  //* Get transaction
  const getTransactionCommand = smartContractsCommand.command("get-transaction").description("Get a transaction")
  // Add options
  defaultOptions.forEach((option) => {
    getTransactionCommand.addOption(new Option(option.flags, option.description))
  })
  getTransactionCommand.argument("<transactionId>", "Transaction ID").action(async (transactionId, options) => {
    const smartDev = await getSmartDev({
      endpoint: options.endpoint,
      apiKeyId: options.apiKeyId,
      apiKeySecret: options.apiKeySecret,
    })
    const transaction = await smartDev.smartContracts.getTransaction({
      id: transactionId,
    })
    logger.defaultLog(transaction)
  })
}
