export const endpointOption = {
  flags: "-e, --endpoint <endpoint>",
  description: "Endpoint URL",
}

export const defaultOptions = [
  endpointOption,
  {
    flags: "-k, --api-key-id <apiKeyId>",
    description: "API key ID",
  },
  {
    flags: "-s, --api-key-secret <apiKeySecret>",
    description: "API key secret",
  },
]
