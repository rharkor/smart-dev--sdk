import { Command, Option } from "commander"

import { getLogin } from "../../lib/cli-utils"
import { endpointOption } from "../utils"

export const registerLogin = (program: Command) => {
  //* Login
  program
    .command("login")
    .description("Login to the CLI")
    .addOption(new Option(endpointOption.flags, endpointOption.description))
    .action(async (options) => {
      const login = await getLogin({
        endpoint: options.endpoint,
      })
      await login.login()
    })
}
