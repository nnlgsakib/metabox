import { ipcMain } from "electron"
import express from "express"
import http from "http"

const app: Express.Application = express()

export class Api {
	server: http.Server
	constructor() {
		this.server = http.createServer(app)
		this.server.listen(11235, () => {})
	}
}
