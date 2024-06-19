import { config } from "dotenv"
import getSmartDev from "src"
config()

const main = async () => {
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

main()
