import inquirer from "inquirer"
import open from "open"

import { generateExampleKeyResponseSchema } from "@smart-dev/schemas/cli-login"

import { getApiKeyId, getApiKeySecret, storeApiKeyId, storeApiKeySecret } from "../lib/cli-utils/store"
import { logger } from "../lib/logger"

export const login = ({ endpoint: _endpoint }: { endpoint: string }) => {
  const endpoint = _endpoint.endsWith("/") ? _endpoint.slice(0, -1) : _endpoint

  const login = async () => {
    //* Request a key from the server
    logger.info("Requesting credentials...")
    const res = await fetch(`${endpoint}/api/cli-login/`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to generate credentials (${res.status}): ${text}`)
    }
    const resJson = await res.json()
    const parsed = generateExampleKeyResponseSchema().safeParse(resJson)
    if (!parsed.success) {
      throw new Error(`Failed to parse response: ${parsed.error}`)
    }
    const key = parsed.data
    logger.success("Credentials received successfully")
    const actualApiKeyId = getApiKeyId()
    const actualApiKeySecret = getApiKeySecret()
    if (actualApiKeyId || actualApiKeySecret) {
      logger.warn("You already have credentials stored. They will be overwritten.")
      // Should continue?
      const { continue: shouldContinue } = await inquirer.prompt({
        type: "confirm",
        name: "continue",
        message: "Do you want to continue?",
      })
      if (!shouldContinue) {
        logger.info("Login cancelled")
        return
      }
    }
    storeApiKeyId(key.id)
    storeApiKeySecret(key.secret)
    logger.success("Credentials stored successfully")

    //* Prompt the user
    const url = `${endpoint}/cli-login?k=${key.id}`
    const message = `Press Enter to open the browser or visit ${url} (^C to quit)`
    logger.info(message)
    await inquirer.prompt({
      type: "input",
      name: "open",
      message: "Press Enter to open the browser",
    })
    open(url)
  }

  return {
    login,
  }
}
