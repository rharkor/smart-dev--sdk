/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from "dotenv"
import getSmartDev from "src"
config()

const executeContractMethod = async () => {
  const smartDev = getSmartDev({
    endpoint: "http://localhost:3000",
    apiKeyId: process.env.SMART_DEV_API_KEY_ID as string,
    apiKeySecret: process.env.SMART_DEV_API_KEY_SECRET as string,
  })

  const res = await smartDev.smartContracts.callContractMethod({
    poolId: "clxh8j8ua0001wact0t562zjs",
    encryptionKey: process.env.SMART_DEV_ENCRYPTION_KEY as string,
    smartContractId: "clwt0th7q000036g9cak5rp6g",
    method: "tupleInput((string, uint256, bool))",
    methodParams: [{ status: "test", another: 10, valid: true }],
    customSort: {
      smartContractId: "clwt0th7q000036g9cak5rp6g",
      method: "getRandomNumber(uint256)",
      direction: "asc",
      resultKind: "bigint",
      methodParams: [10],
    },
  })

  console.log(res)

  const res2 = await res.wait()

  console.log(res2)
}

const getAvailableNodeAddress = async () => {
  const smartDev = getSmartDev({
    endpoint: "http://localhost:3000",
    apiKeyId: process.env.SMART_DEV_API_KEY_ID as string,
    apiKeySecret: process.env.SMART_DEV_API_KEY_SECRET as string,
  })

  const res = await smartDev.smartContracts.getAvailableNodeAddress({
    poolId: "clxnirlhj0001ip8aqfun0rx1",
    encryptionKey: process.env.SMART_DEV_ENCRYPTION_KEY as string,
    customSort: {
      smartContractId: "clwt0th7q000036g9cak5rp6g",
      method: "getActive(address)",
      direction: "asc",
      resultKind: "boolean",
      methodParams: ["0xe3d8aB43Dc9FC21bB0c1DA13eC4DAe90C1108f95"],
      resultKey: "0",
      // method: "getRandomNumber(uint256)",
      // direction: "asc",
      // resultKind: "bigint",
      // methodParams: [10],
    },
  })

  console.log(res)
}

getAvailableNodeAddress()
