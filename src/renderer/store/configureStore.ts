import { Reducer } from "react"
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { ReducerAuth } from "./reducers/auth.reducer"
import { ReducerSettings } from "./reducers/settings.reducer"
import { ReducerTransactions } from "./reducers/transactions.reducer"
import { ReducerWallets } from "./reducers/wallets.reducer"
import { RootSaga } from "./root.saga"
import { walletsTransform } from "./transforms/wallets.transform"
import { currentNetworkTransform, networksTransform } from "./transforms/network.transform"
import { ReducerNetwork } from "./reducers/network.reducer"

const authReducer = persistReducer(
	{
		key: "auth",
		storage,
		// We don not store password directly into the local storage(except the development process for ease of use), instead of password, we store passwordHash
		blacklist: process.env.NODE_ENV == "development" ? [] : ["password"],
	},
	ReducerAuth as Reducer<any, any>,
)

const networkReducer = persistReducer(
	{
		key: "network",
		storage,
		transforms: [currentNetworkTransform, networksTransform],
	},
	ReducerNetwork as Reducer<any, any>,
)

const settingsReducer = persistReducer(
	{
		key: "settings",
		storage,
	},
	ReducerSettings as Reducer<any, any>,
)

const transactionsReducer = persistReducer(
	{
		key: "transactions",
		storage,
	},
	ReducerTransactions as Reducer<any, any>,
)

const walletsReducer = persistReducer(
	{
		key: "wallets",
		storage,
		transforms: [walletsTransform],
	},
	ReducerWallets as Reducer<any, any>,
)

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
	const store = createStore(
		combineReducers({
			auth: authReducer,
			network: networkReducer,
			settings: settingsReducer,
			transactions: transactionsReducer,
			wallets: walletsReducer,
		}),
		composeEnhancers(applyMiddleware(sagaMiddleware)),
	)
	sagaMiddleware.run(RootSaga)
	const persistor = persistStore(store)
	return { store, persistor }
}
