import WordList from "./wordlist.json"
import { RandomInt } from "./random-int.helper"

export function GenerateRandomMnemonic(length: number = 12): string[] {
	const list: string[] = []
	while (list.length < length) {
		const phrase = WordList[RandomInt(0, WordList.length - 1)]
		if (!list.find((w) => w == phrase)) list.push(phrase)
	}
	return list
}
