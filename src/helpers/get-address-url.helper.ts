import urlParse from "url-parse"

export function getAddressUrl(url: string, address: string): string {
	return `${urlParse(url).origin}/address/${address}`
}
