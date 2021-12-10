import { ipcMain } from "electron"
import express from "express"
import http from "http"
import { Server as IOServer } from "socket.io"

const app: Express.Application = express()

export class Api {
	// server
	// socket: IOServer
	constructor() {
		// this.server = http.createServer(app)
		// this.socket = new IOServer(this.server)
		// this.server.listen(11235, () => {})
	}
}
