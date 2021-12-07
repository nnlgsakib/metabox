import React from "react"

import { Grid } from "@mui/material"
import { HomeHeaderComponent } from "./components/home-header.component"

export function HomeView() {
	return (
		<React.Fragment>
			<HomeHeaderComponent />
			<Grid container justifyContent="center">
				<Grid item xs={12} sm={9} md={6}></Grid>
			</Grid>
		</React.Fragment>
	)
}
