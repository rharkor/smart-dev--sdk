import { program } from "commander"

import pJson from "../package.json"

import { registerCli } from "./cli/index"
import { logger } from "./lib/logger"

program
  .command("version")
  .description("Show the version")
  .action(() => {
    logger.defaultLog(pJson.version)
  })

registerCli(program)

program.parse()
