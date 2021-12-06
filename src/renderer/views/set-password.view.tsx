import { AppBar, Button, TextField, Typography, Toolbar, IconButton } from "@mui/material"
import React from "react"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import PasswordStrengthBar from "react-password-strength-bar"
import { useDispatch } from "react-redux"
import { AuthAction } from "renderer/store/reducers/auth.reducer"
import Crypto from "crypto-js"

export function SetPasswordView() {
	const dispatch = useDispatch()

	const [newPassword, setNewPassword] = React.useState("")
	const [repeatPassword, setRepeatPassword] = React.useState("")

	const onNewPasswordChanged = React.useCallback((e) => setNewPassword(e.target.value), [setNewPassword])
	const onRepeatPasswordChanged = React.useCallback(
		(e) => setRepeatPassword(e.target.value),
		[setRepeatPassword],
	)
	const passwordExactMatch = React.useMemo(() => newPassword == repeatPassword, [newPassword, repeatPassword])
	const doesNotExactMatch = React.useMemo(
		() => !passwordExactMatch && repeatPassword.length > 3,
		[passwordExactMatch, repeatPassword.length],
	)

	const savePassword = React.useCallback(() => {
		const hash = Crypto.SHA512(newPassword).toString()
		dispatch({ type: AuthAction.SetPassword, password: newPassword, passwordHash: hash })
	}, [dispatch, newPassword])

	return (
		<React.Fragment>
			<AppBar position="static" className="appBarHeight">
				<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<ArrowBackIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Reset Password
					</Typography>
				</Toolbar>
			</AppBar>
			<div className="flex-col-center">
				<div className="p10">
					<TextField
						style={{ marginTop: 20 }}
						fullWidth
						variant="filled"
						label="New Password"
						type="password"
						onChange={onNewPasswordChanged}
						inputProps={{ max: 40 }}
						helperText="Min 8 characters"
					/>
					<TextField
						style={{ marginTop: 20 }}
						fullWidth
						variant="filled"
						label="Repeat New Password"
						type="password"
						onChange={onRepeatPasswordChanged}
						color={doesNotExactMatch ? "error" : "primary"}
						inputProps={{ max: 40 }}
						helperText={doesNotExactMatch ? "The new password and The repeat password do not match!" : null}
					/>
					<PasswordStrengthBar password={newPassword} />
					<Button
						size="large"
						variant="contained"
						color="primary"
						fullWidth
						style={{ marginTop: 20 }}
						onClick={savePassword}
					>
						Set password
					</Button>
				</div>
			</div>
		</React.Fragment>
	)
}
