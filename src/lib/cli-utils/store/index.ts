import Conf from "conf"
import envPaths from "env-paths"
import inquirer from "inquirer"
import * as path from "path"

import pJson from "../../../../package.json"
import { defaultEndpoint } from "../../../lib/constants"

const projectName = "smart-dev"
const cwd = envPaths(projectName).config

const config = new Conf({
  projectName,
  projectVersion: pJson.version,
  cwd,
  schema: {
    apiKeyId: {
      type: "string",
      default: undefined,
    },
    apiKeySecret: {
      type: "string",
      default: undefined,
    },
    endpoint: {
      type: "string",
      default: undefined,
    },
  },
})

export const getConfigLocation = () => {
  return path.join(cwd, "config.json")
}

export const resetConfig = () => {
  config.clear()
}

export const getApiKeyId = () => {
  return config.get("apiKeyId") as string | undefined
}

export const storeApiKeyId = (apiKeyId: string) => {
  config.set("apiKeyId", apiKeyId)
}

export const getSertApiKeyId = async () => {
  const apiKeyId = getApiKeyId()
  if (apiKeyId) {
    return apiKeyId
  }
  const { apiKeyId: apiKeyIdAnswer } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKeyId",
      message: "Enter your API key ID",
    },
  ])
  storeApiKeyId(apiKeyIdAnswer)
  return apiKeyIdAnswer as string
}

export const getApiKeySecret = () => {
  return config.get("apiKeySecret") as string | undefined
}

export const storeApiKeySecret = (apiKeySecret: string) => {
  config.set("apiKeySecret", apiKeySecret)
}

export const getSertApiKeySecret = async () => {
  const apiKeySecret = getApiKeySecret()
  if (apiKeySecret) {
    return apiKeySecret
  }
  const { apiKeySecret: apiKeySecretAnswer } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKeySecret",
      message: "Enter your API key secret",
    },
  ])
  storeApiKeySecret(apiKeySecretAnswer)
  return apiKeySecretAnswer as string
}

export const getEndpoint = () => {
  return config.get("endpoint") as string | undefined
}

export const storeEndpoint = (endpoint: string) => {
  config.set("endpoint", endpoint)
}

export const getSertEndpoint = async () => {
  const endpoint = getEndpoint()
  if (endpoint) {
    return endpoint
  }
  storeEndpoint(defaultEndpoint)
  return defaultEndpoint
}
