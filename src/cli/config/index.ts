import { Command } from "commander"
import inquirer from "inquirer"

import { resetConfig, storeApiKeyId, storeApiKeySecret, storeEndpoint } from "../../lib/cli-utils/store"
import { logger } from "../../lib/logger"

export const registerConfig = (program: Command) => {
  //* Configure
  const configureCommand = new Command("config").description("Configure the CLI")
  // Reset
  configureCommand
    .command("reset")
    .description("Reset the configuration")
    .action(async () => {
      resetConfig()
      logger.info("Configuration reset")
    })
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
}
