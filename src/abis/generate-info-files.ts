import fs from "fs"
import { generateAbiInfo } from "../helpers/generate-abi-info.helper"
import path from "path"

//// Creates *.abi.info.json file for every function in *.abi.json file in the current folder.
/// *.abi.info.json files are used to identify transaction data method (only known methods, like : transfer, approve and etc)

const abisFileName = fs.readdirSync(__dirname).filter((fileName) => fileName.match(/[\w].abi.json/))

for (const fileName of abisFileName) {
	const functions = JSON.parse(fs.readFileSync(path.join(__dirname, fileName)).toString()).filter(
		(method) => method.type == "function" && method.stateMutability != "view",
	)
	const info = generateAbiInfo(functions)
	const realFileName = fileName.slice(0, fileName.match(/[\w].abi.json/).index + 1)
	const infoFileName = `${realFileName}.abi.info.json`
	fs.writeFileSync(path.join(__dirname, infoFileName), JSON.stringify(info, null, "\t"))
}
