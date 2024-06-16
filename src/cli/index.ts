import { Command } from "commander"

import { registerConfig } from "./config"
import { registerGetConfig } from "./get-config"
import { registerLogin } from "./login"
import { registerSmartContracts } from "./smart-contracts"

export const registerCli = (program: Command) => {
  registerConfig(program)
  registerGetConfig(program)
  registerSmartContracts(program)
  registerLogin(program)
}
