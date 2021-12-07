import { createTransform } from "redux-persist"
import { Network } from "renderer/models/network.model"
import _ from "lodash"

export const simpleObjectToNetwork = (n: Network) =>
	new Network(n.id, n.url, n.name, n.token, n.explorer, n.isTestnet, n.locked)

export const networkToSimpleObject = (network: Network) => _.omit(network, ["provider"]) as Network

export const networksTransform = createTransform(
	(inboundState: Network[]) => inboundState.map(networkToSimpleObject),
	(outboundState: Network[]) => outboundState.map(simpleObjectToNetwork),
	{ whitelist: ["networks"] },
)

export const currentNetworkTransform = createTransform(networkToSimpleObject, simpleObjectToNetwork, {
	whitelist: ["current"],
})
