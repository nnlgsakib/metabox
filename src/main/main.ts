/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import "core-js/stable"
import "regenerator-runtime/runtime"
import path from "path"
import { app, BrowserWindow, ipcMain, Menu, shell, Tray, Notification } from "electron"
import { autoUpdater } from "electron-updater"
import log from "electron-log"
import { resolveHtmlPath } from "./util"
import { rpc } from "./rpc/json-rpc-api"
require("@electron/remote/main").initialize()

export default class AppUpdater {
	constructor() {
		log.transports.file.level = "info"
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

let mainWindow: BrowserWindow | null = null

if (process.env.NODE_ENV === "production") {
	const sourceMapSupport = require("source-map-support")
	sourceMapSupport.install()
}

const isDevelopment = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true"

if (isDevelopment) {
	require("electron-debug")()
}

const installExtensions = async () => {
	const installer = require("electron-devtools-installer")
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS
	const extensions = ["REACT_DEVELOPER_TOOLS"]

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload,
		)
		.catch(console.log)
}

const hideWindow = (e?: Electron.Event) => {
	e?.preventDefault()
	mainWindow?.hide()
}
const RESOURCES_PATH = app.isPackaged
	? path.join(process.resourcesPath, "assets")
	: path.join(__dirname, "../../assets")

const getAssetPath = (...paths: string[]): string => {
	return path.join(RESOURCES_PATH, ...paths)
}
const AppIconPath = getAssetPath("icon.png")

const createWindow = async () => {
	if (isDevelopment) {
		await installExtensions()
	}

	mainWindow = new BrowserWindow({
		show: false,
		width: 450,
		height: 680,
		maxWidth: isDevelopment ? undefined : 600,
		minWidth: 450,
		maxHeight: isDevelopment ? undefined : 1200,
		minHeight: 500,
		icon: AppIconPath,
		frame: false,
		title: "Metaverse Wallet",
		darkTheme: true,
		fullscreenable: false,
		maximizable: false,

		webPreferences: {
			// preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
		},
	})
	require("@electron/remote/main").enable((mainWindow as BrowserWindow).webContents)

	mainWindow.loadURL(resolveHtmlPath("index.html"))

	mainWindow.on("ready-to-show", () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined')
		}
		mainWindow.show()
		mainWindow.focus()
	})

	mainWindow.on("closed", hideWindow)
	mainWindow.on("close", hideWindow)

	// Open urls in the user's browser
	mainWindow.webContents.on("new-window", (event, url) => {
		event.preventDefault()
		shell.openExternal(url)
	})

	// eslint-disable-next-line
	new AppUpdater()
}

let tray = null
const showMainWindow = () => {
	mainWindow?.show()
}
const additionalData = { myKey: "myValue" }
const gotTheLock = app.requestSingleInstanceLock(additionalData)

if (!gotTheLock) {
	app.quit()
} else {
	app.on("quit", hideWindow)
	app.on("window-all-closed", hideWindow)

	app.on("second-instance", (event, commandLine, workingDirectory, additionalData) => {
		// Print out data received from the second instance.
		console.log(additionalData)

		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore()
			mainWindow.show()
			mainWindow.focus()
		}
	})

	// Create myWindow, load the rest of the app, etc...
	app
		.whenReady()
		.then(() => {
			createWindow()
			app.on("activate", () => {
				// On macOS it's common to re-create a window in the app when the
				// dock icon is clicked and there are no other windows open.
				if (mainWindow === null) createWindow()
			})

			tray = new Tray(AppIconPath)
			const contextMenu = Menu.buildFromTemplate([
				{
					label: "Show Wallet",
					type: "normal",
					click: showMainWindow,
				},
				{
					label: "Lock Wallet",
					type: "normal",
					click: () => {
						ipcMain.emit("lock-wallet")
						new Notification({ title: "MetaBox Wallet", body: "Wallet locked !" }).show()
					},
				},
				{
					type: "separator",
				},
				{
					label: "Quit Wallet",
					type: "normal",
					toolTip: "Close wallet even in the background !",
					click: () => {
						mainWindow?.removeAllListeners()
						app.removeAllListeners()
						mainWindow?.close()
						app.quit()
					},
				},
			])
			tray.setToolTip("MetaBox Wallet")
			tray.on("click", showMainWindow)
			tray.on("double-click", showMainWindow)
			tray.setContextMenu(contextMenu)
		})
		.catch(console.log)
}

rpc
