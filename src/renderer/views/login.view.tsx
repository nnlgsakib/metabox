import { Button, TextField, Typography } from "@mui/material"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AuthAction, IAuthState } from "renderer/store/reducers/auth.reducer"
import Crypto from "crypto-js"
import LockOpenIcon from "@mui/icons-material/LockOpen"

export function LoginView() {
	const dispatch = useDispatch()
	const auth: IAuthState = useSelector((s: any) => s.auth)
	const [wrongPass, setWrongPass] = React.useState(false)

	const [password, setPassword] = React.useState("")
	const onPasswordChanged = React.useCallback(
		(e) => {
			if (wrongPass) setWrongPass(false)
			setPassword(e.target.value)
		},
		[setPassword, wrongPass],
	)

	const attemptUnlock = React.useCallback(() => {
		const hash = Crypto.SHA3(password).toString(Crypto.enc.Base64)
		if (hash != auth.passwordHash) {
			setWrongPass(true)
			return
		}
		dispatch({ type: AuthAction.SetPassword, password })
	}, [password])

	return (
		<React.Fragment>
			<div className="flex-col-center">
				<Typography variant="h4" style={{ marginBottom: 40, marginTop: 50 }}>
					Welcome back!
				</Typography>
				<div className="p10">
					<TextField
						style={{ marginTop: 20 }}
						fullWidth
						variant="filled"
						label="Password"
						type="password"
						onChange={onPasswordChanged}
						inputProps={{ max: 40 }}
						color={wrongPass ? "error" : "primary"}
						helperText={wrongPass ? "Password is incorrect, please try again." : null}
					/>
					<Button
						size="large"
						variant="contained"
						color="primary"
						fullWidth
						style={{ marginTop: 20 }}
						onClick={attemptUnlock}
					>
						<LockOpenIcon sx={{ fontSize: 20 }} />
						Unlock
					</Button>
				</div>
			</div>
		</React.Fragment>
	)
}
