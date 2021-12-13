import "./App.css"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import configureStore from "./store/configureStore"
import { AppLayout } from "./App.layout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { TitleBar } from "./views/components/title-bar.component"

const { store, persistor } = configureStore()
const isTransactionWindow = window.process.argv.indexOf("transactions-window") > -1
export default function App() {
	if (isTransactionWindow) {
		return (
			<div>
				<h3>This is a transaction view</h3>
			</div>
		)
	}
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<TitleBar />
				<AppLayout />
				<ToastContainer limit={5} theme="light" position="bottom-left" closeOnClick={false} />
			</PersistGate>
		</Provider>
	)
}
