import { Command } from "commander"

import { getApiKeyId, getApiKeySecret, getConfigLocation, getEndpoint } from "../../lib/cli-utils/store"
import { logger } from "../../lib/logger"

export const registerGetConfig = (program: Command) => {
  //* Configure
  program
    .command("get-config")
    .description("Get the CLI configuration")
    .action(async () => {
      const fileLocation = getConfigLocation()
      const endpoint = getEndpoint()
      const apiKeyId = getApiKeyId()
      const apiKeySecret = getApiKeySecret()
      logger.info(`Configuration file location: ${fileLocation}`)
      logger.info(`Endpoint: ${endpoint ? endpoint : "not set"}`)
      logger.info(`API key ID: ${apiKeyId ? apiKeyId : "not set"}`)
      logger.info(
        `API key secret: ${
          apiKeySecret
            ? apiKeySecret
                .split("")
                .map((c, i) => {
                  if (i > apiKeySecret.length - 5) return c
                  return "*"
                })
                .join("")
            : "not set"
        }`
      )
    })
}
