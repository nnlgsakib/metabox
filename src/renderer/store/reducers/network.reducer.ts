import { createReducer, AnyAction } from "@reduxjs/toolkit"
import { Network } from "renderer/models/network.model"
import DefaultNetworks from "../default-networks.json"
import { simpleObjectToNetwork } from "../transforms/network.transform"

export enum NetworkAction {
	NewNetwork = "NewNetwork",
	SetCurrent = "SetCurrent",
}

export interface INetworkState {
	current: Network
	networks: Network[]
}

const defaultNets = (DefaultNetworks as Network[]).map(simpleObjectToNetwork)

const initialState: INetworkState = {
	current: defaultNets.find((network) => network.id == 1) as Network,
	networks: defaultNets,
}

export const ReducerNetwork = createReducer<INetworkState>(initialState, (builder) => {
	builder.addCase(NetworkAction.NewNetwork, (state, action: AnyAction) => {
		state.networks.push(action.network)
	})
	builder.addCase(NetworkAction.SetCurrent, (state, action: AnyAction) => {
		const network = state.networks.find((n) => n.id == action.networkId)
		if (network) {
			if (state.current?.hasProvider()) state.current?.renounceProvider()
			state.current = network
		}
	})
})
