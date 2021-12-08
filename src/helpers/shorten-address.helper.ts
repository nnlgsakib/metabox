export function shortenAddress(address: string): string | null {
	if (!address) return null
	return address.slice(0, 6) + "..." + address.slice(address.length - 4)
}
