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
	},
	ReducerWallets as Reducer<any, any>,
)

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
	const store = createStore(
		combineReducers({
			auth: ReducerAuth,
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
