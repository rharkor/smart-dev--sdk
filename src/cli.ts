import { Command, Option, program } from "commander"
import inquirer from "inquirer"
import { z } from "zod"

import { callContractMethodSchema } from "@smart-dev/schemas/transactions"

import pJson from "../package.json"

import { getSmartDev } from "./lib/cli-utils"
import { storeApiKeyId, storeApiKeySecret, storeEndpoint } from "./lib/cli-utils/store"
import { logger } from "./lib/logger"

program.command("version").action(() => {
  logger.defaultLog(pJson.version)
})

//* Configure
const configureCommand = new Command("configure").description("Configure the CLI")
// Full
configureCommand
  .command("full")
  .description("Set the full configuration")
  .action(async () => {
    const { endpoint, apiKeyId, apiKeySecret } = await inquirer.prompt([
      {
        type: "input",
        name: "endpoint",
        message: "Enter the endpoint, e.g. https://app.smartdev.com, press enter to skip",
      },
      {
        type: "input",
        name: "apiKeyId",
        message: "Enter the API key ID, press enter to skip",
      },
      {
        type: "input",
        name: "apiKeySecret",
        message: "Enter the API key secret, press enter to skip",
      },
    ])
    if (endpoint) {
      storeEndpoint(endpoint)
      logger.info(`Endpoint set to ${endpoint}`)
    }
    if (apiKeyId) {
      storeApiKeyId(apiKeyId)
      logger.info(`API key ID set to ${apiKeyId}`)
    }
    if (apiKeySecret) {
      storeApiKeySecret(apiKeySecret)
      logger.info(`API key secret set to ${apiKeySecret}`)
    }
  })
// Endpoint
configureCommand
  .command("endpoint")
  .description("Set the endpoint")
  .action(async () => {
    const { endpoint } = await inquirer.prompt([
      {
        type: "input",
        name: "endpoint",
        message: "Enter the endpoint, e.g. https://app.smartdev.com, press enter to skip",
      },
    ])
    if (endpoint) {
      storeEndpoint(endpoint)
      logger.info(`Endpoint set to ${endpoint}`)
    }
  })
// API key ID
configureCommand
  .command("api-key-id")
  .description("Set the API key ID")
  .action(async () => {
    const { apiKeyId } = await inquirer.prompt([
      {
        type: "input",
        name: "apiKeyId",
        message: "Enter the API key ID, press enter to skip",
      },
    ])
    if (apiKeyId) {
      storeApiKeyId(apiKeyId)
      logger.info(`API key ID set to ${apiKeyId}`)
    }
  })
// API key secret
configureCommand
  .command("api-key-secret")
  .description("Set the API key secret")
  .action(async () => {
    const { apiKeySecret } = await inquirer.prompt([
      {
        type: "input",
        name: "apiKeySecret",
        message: "Enter the API key secret, press enter to skip",
      },
    ])
    if (apiKeySecret) {
      storeApiKeySecret(apiKeySecret)
      logger.info(`API key secret set to ${apiKeySecret}`)
    }
  })

program.addCommand(configureCommand)

const defaultOptions = [
  {
    flags: "-e, --endpoint <endpoint>",
    description: "Endpoint URL",
  },
  {
    flags: "-k, --api-key-id <apiKeyId>",
    description: "API key ID",
  },
  {
    flags: "-s, --api-key-secret <apiKeySecret>",
    description: "API key secret",
  },
]

//* SMART CONTRACTS
const smartContractsCommand = new Command("smart-contracts").description("Interact with smart contracts")

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
//* Call contract method
const callContractMethodCommand = smartContractsCommand
  .command("call-contract-method")
  .description("Call a contract method")
// Add options
defaultOptions.forEach((option) => {
  callContractMethodCommand.addOption(new Option(option.flags, option.description))
})
callContractMethodCommand.action(async (options) => {
  const questions = [
    {
      type: "input",
      name: "smartContractId",
      message: "Enter the smart contract ID",
    },
    {
      type: "input",
      name: "method",
      message: 'Enter the method, e.g. "balanceOf(address account)"',
    },
    {
      type: "input",
      name: "methodParams",
      message: 'Enter the method params, e.g. ["arg1", "arg2"]',
    },
    {
      type: "input",
      name: "walletsFolderId",
      message: "Enter the wallets folder ID",
    },
    {
      type: "input",
      name: "encryptionKey",
      message: "Enter the encryption key for the wallets",
    },
  ]
  const { smartContractId, method, methodParams, walletsFolderId, encryptionKey } = await inquirer.prompt(questions)
  const smartDev = await getSmartDev({
    endpoint: options.endpoint,
    apiKeyId: options.apiKeyId,
    apiKeySecret: options.apiKeySecret,
  })

  // Advanced params
  const wantAdvancedParams = await inquirer.prompt([
    {
      type: "confirm",
      name: "wantAdvancedParams",
      message: "Do you want to set advanced params?",
    },
  ])
  let transactionParams: z.infer<ReturnType<typeof callContractMethodSchema>>["transactionParams"]
  let walletsTags: z.infer<ReturnType<typeof callContractMethodSchema>>["walletsTags"]
  let version: z.infer<ReturnType<typeof callContractMethodSchema>>["version"]
  if (wantAdvancedParams.wantAdvancedParams) {
    const advancedQuestions = [
      {
        type: "input",
        name: "walletsTags",
        message: "Enter the wallets tags, e.g. ['tag1', 'tag2'], press enter to skip",
      },
      {
        type: "input",
        name: "version",
        message: "Enter the version, e.g. 13, press enter to skip",
      },
    ]
    const advancedAnswers = await inquirer.prompt(advancedQuestions)
    walletsTags = advancedAnswers.walletsTags ? JSON.parse(advancedAnswers.walletsTags) : undefined
    version = advancedAnswers.version ? parseInt(advancedAnswers.version) : undefined

    const wantTransactionParams = await inquirer.prompt([
      {
        type: "confirm",
        name: "wantTransactionParams",
        message: "Do you want to set transaction params?",
      },
    ])
    if (wantTransactionParams.wantTransactionParams) {
      const transactionParamsQuestions = [
        {
          type: "input",
          name: "value",
          message: "Enter the value",
        },
      ]
      const transactionParamsAnswers = await inquirer.prompt(transactionParamsQuestions)
      transactionParams = {
        value: transactionParamsAnswers.value,
      }
    }
  }

  const res = await smartDev.smartContracts.callContractMethod({
    smartContractId,
    method,
    methodParams: JSON.parse(methodParams),
    walletsFolderId,
    encryptionKey,
    transactionParams,
    version,
    walletsTags,
  })
  if (res.data.status === "error") {
    logger.error(res.data.error.message)
    console.error(res.data.error.original as string)
    process.exit(1)
  } else if (res.data.status === "success") {
    logger.defaultLog(res.data)
  } else {
    if (typeof res.data.result === "object" && res.data.result && "hash" in res.data.result) {
      const hash = res.data.result.hash
      logger.info(`Transaction sent (hash: ${hash})`)
    } else {
      logger.info("Transaction sent", res.data.result)
    }
    //* Wait to be mined
    const transaction = await res.wait()
    if (transaction.status === "SUCCESS") {
      logger.info("Transaction mined")
      logger.defaultLog(transaction)
    }
  }
})

program.addCommand(smartContractsCommand)

program.parse()
