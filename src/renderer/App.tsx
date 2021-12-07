import "./App.css"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import configureStore from "./store/configureStore"
import { AppLayout } from "./App.layout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const { store, persistor } = configureStore()

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppLayout />
				<ToastContainer limit={5} theme="light" position="bottom-left" closeOnClick={false} />
			</PersistGate>
		</Provider>
	)
}
