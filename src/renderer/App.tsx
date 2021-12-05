import "./App.css"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import configureStore from "./store/configureStore"
import { AppLayout } from "./App.layout"

const { store, persistor } = configureStore()

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppLayout />
			</PersistGate>
		</Provider>
	)
}
