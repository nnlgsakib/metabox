import React from "react"
import {
	Button,
	Checkbox,
	Chip,
	Divider,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	TextField,
	Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import copyToClipboard from "copy-to-clipboard"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { WalletsAction } from "renderer/store/reducers/wallets.reducer"
import { Wallet } from "renderer/models/wallet.model"
import { v4 as uuid } from "uuid"
import { ethers } from "ethers"

const MNEMONIC_PHRASES_COUNT = 12
const isDevelopment = process.env.NODE_ENV == "development"

export function CreateNewWalletComponent({
	setView,
	onWalletCreated,
}: {
	setView: (v: number) => void
	onWalletCreated?: () => void
}) {
	const walletsCount: number = useSelector((s: any) => (s.wallets.length ? s.wallets.length : 0))
	const __password: string = useSelector((s: any) => s.auth.password)
	const dispatch = useDispatch()
	const [walletName, setWalletName] = React.useState(`Wallet #${walletsCount + 1}`)

	const [phrases, setPhrases] = React.useState<string[]>([])
	const [approveCheckbox, setApproveCheckbox] = React.useState(false)

	// Challenge states
	const [challengeView, setChallengeView] = React.useState(false)
	const [selectedWords, setSelectedWords] = React.useState<string[]>([])

	React.useEffect(() => {
		if (!phrases || phrases.length == 0) {
			setPhrases(ethers.Wallet.createRandom().mnemonic.phrase.split(" "))
		}
	}, [phrases])

	const availableWordsToSelect = React.useMemo(
		() => phrases.filter((phrase) => !selectedWords.find((w) => phrase == w)),
		[phrases, selectedWords],
	)

	const doesSelectedWordsMatch = React.useMemo(() => {
		for (let i = 0; i < phrases.length; i++) {
			if (phrases[i] != selectedWords[i]) return false
		}
		return true
	}, [phrases, selectedWords])

	const phrasesString = React.useMemo(() => phrases.join(" "), [phrases])

	const copyPhraseToClipboard = React.useCallback(() => {
		copyToClipboard(phrasesString)
		toast.info("The secret phrase copied to the clipboard", {})
	}, [phrasesString])

	const onClickBack = React.useCallback(() => {
		if (!challengeView) {
			if (setView) setView(0)
		} else {
			setChallengeView(false)
			setSelectedWords([])
		}
	}, [challengeView, setView, setSelectedWords])

	const saveWallet = React.useCallback(() => {
		const mnemonic = Wallet.encrypt(phrasesString, __password)
		const wallet: Wallet = new Wallet(uuid(), walletName, mnemonic)
		wallet.newAccount(`Account 1`, __password)
		dispatch({ type: WalletsAction.NewWallet, wallet })
	}, [phrases])

	return (
		<React.Fragment>
			<Grid container justifyContent="center">
				<Grid item xs={12} md={6} lg={4}>
					<div className="p15">
						<div style={{ display: "flex", width: "100%", height: 70, alignItems: "center" }}>
							<IconButton onClick={onClickBack}>
								<ArrowBackIcon />
							</IconButton>
							<Typography variant="h5" style={{ marginLeft: 20 }}>
								Secret Recovery Phrase
							</Typography>
						</div>

						<Typography variant="body1">
							Your Secret Recovery Phrase makes it easy to back up and restore your account.
						</Typography>

						{challengeView ? (
							<React.Fragment>
								<Typography variant="body1" style={{ marginBottom: 10 }}>
									Now select every word based on it's correct order.
								</Typography>
								<div className="p10">
									{selectedWords.map((w, i) => (
										<Chip
											key={w}
											style={{ margin: 6 }}
											label={`${i + 1} - ${w}`}
											onDelete={() => setSelectedWords(selectedWords.filter((word) => word != w))}
										/>
									))}
								</div>
								<div className="p10">
									<Divider />
								</div>
								<div>
									{availableWordsToSelect.sort().map((w) => (
										<Chip
											key={w}
											style={{ margin: 6 }}
											label={w}
											variant="outlined"
											onClick={() => setSelectedWords([...selectedWords, w])}
										/>
									))}
								</div>
								{selectedWords.length == phrases.length && !doesSelectedWordsMatch ? (
									<div>
										<Typography color="error" variant="body2">
											** The selected words does not follow the correct order of the Secret Phrase.
										</Typography>
									</div>
								) : null}
								<div>
									<TextField
										variant="outlined"
										color="primary"
										value={walletName}
										label="Wallet Name"
										onChange={(e) => setWalletName(e.target.value)}
										inputProps={{ maxLength: 10 }}
										fullWidth
										style={{ marginTop: 10 }}
										variant="filled"
										color={walletName.length < 3 ? "error" : undefined}
										helperText={walletName.length < 3 ? "* Min 3 characters" : undefined}
									/>
								</div>
								<div className="p10" style={{ display: "flex", flexDirection: "row-reverse" }}>
									<Button
										variant="contained"
										color="primary"
										onClick={saveWallet}
										disabled={(!doesSelectedWordsMatch && !isDevelopment) || walletName.length < 3}
									>
										Save wallet
									</Button>
								</div>
							</React.Fragment>
						) : (
							<React.Fragment>
								<TextField
									label="Secret Phrase:"
									style={{ marginTop: 20 }}
									inputProps={{ style: { fontSize: 22 } }}
									multiline
									value={phrasesString}
									fullWidth
									minRows={4}
								/>

								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox checked={approveCheckbox} onChange={(e, checked) => setApproveCheckbox(checked)} />
										}
										label="I saved the Secret Phrase in a safe place."
									/>
								</FormGroup>

								<div className="p10" style={{ display: "flex", flexDirection: "row-reverse" }}>
									<Button
										variant="contained"
										color="primary"
										size="large"
										disabled={phrases.length != MNEMONIC_PHRASES_COUNT || !approveCheckbox}
										onClick={() => setChallengeView(true)}
									>
										Next
									</Button>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										disabled={phrases.length != MNEMONIC_PHRASES_COUNT}
										style={{ marginRight: 10 }}
										onClick={copyPhraseToClipboard}
									>
										Copy to clipboard
									</Button>
								</div>

								<Typography variant="body1" color="error">
									WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your funds
									forever.
								</Typography>

								<Typography variant="caption">
									Tips: Store this phrase in a password manager like 1Password. Write this phrase on a piece of paper
									and store in a secure location. If you want even more security, write it down on multiple pieces of
									paper and store each in 2 - 3 different locations. Memorize this phrase.
								</Typography>
							</React.Fragment>
						)}
					</div>
				</Grid>
			</Grid>
		</React.Fragment>
	)
}
