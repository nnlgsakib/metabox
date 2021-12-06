import React from "react"
import { Grid, IconButton, TextField, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { GenerateRandomMnemonic } from "helpers/generate-random-mnemonic-phrase.helper"

const MNEMONIC_PHRASES_COUNT = 12

export function CreateNewWalletComponent({ setView }: { setView: (v: number) => void }) {
	const [phrases, setPhrases] = React.useState<string[]>([])

	React.useEffect(() => {
		if (!phrases || phrases.length != MNEMONIC_PHRASES_COUNT)
			setPhrases(GenerateRandomMnemonic(MNEMONIC_PHRASES_COUNT))
	}, [phrases])

	const phrasesString = React.useMemo(() => phrases.join(" "), [phrases])

	return (
		<React.Fragment>
			<Grid container justifyContent="center">
				<Grid item xs={12} md={6} lg={4}>
					<div className="p15">
						<div style={{ display: "flex", width: "100%", height: 70, alignItems: "center" }}>
							<IconButton onClick={() => setView(0)}>
								<ArrowBackIcon />
							</IconButton>
							<Typography variant="h5" style={{ marginLeft: 20 }}>
								Secret Recovery Phrase
							</Typography>
						</div>

						<Typography variant="body1">
							Your Secret Recovery Phrase makes it easy to back up and restore your account.
						</Typography>
						<Typography variant="body1" color="error">
							WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your funds
							forever.
						</Typography>

						<TextField
							label="Secret Phrase:"
							style={{ marginTop: 20 }}
							inputProps={{ style: { fontSize: 22 } }}
							multiline
							value={phrasesString}
							fullWidth
							minRows={4}
						/>

						<Typography variant="caption">
							Tips: Store this phrase in a password manager like 1Password. Write this phrase on a piece of paper and
							store in a secure location. If you want even more security, write it down on multiple pieces of paper
							and store each in 2 - 3 different locations. Memorize this phrase.
						</Typography>
					</div>
				</Grid>
			</Grid>
		</React.Fragment>
	)
}
