/**
 * Pings the given smart-dev api endpoint to check if it is reachable.
 *
 * @param endpoint - The base URL of the endpoint to ping.
 * @returns A promise that resolves to `true` if the endpoint is reachable, otherwise `false`.
 */
export const pingEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${endpoint}/ping`)
    return response.ok
  } catch (e) {
    return false
  }
}
