/**
 * The context object that is passed to the Smart Dev API methods.
 */
export interface IApiMethodContext {
  /**
   * The Smart Dev API endpoint.
   */
  endpoint: string

  /**
   * Your Smart Dev API key ID.
   */
  apiKeyId: string

  /**
   * Your Smart Dev API secret key.
   */
  apiKeySecret: string
}
