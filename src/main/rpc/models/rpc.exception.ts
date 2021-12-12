export class RpcException extends Error {
	code: number
	message: string
	constructor(code: number, message?: string) {
		super(message)
		if (!message) message = this.selectMessage(code)
		this.code = code
		this.message = message
	}
	public static Code = {
		ParseError: -32700,
		InvalidRequest: -32600,
		MethodNotFound: -32601,
		InvalidParams: -32602,
		InternalError: -32603,
		ServerError: -32000,
	}
	public selectMessage(code: number) {
		switch (code) {
			case RpcException.Code.ParseError:
				return "	Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
			case RpcException.Code.InvalidRequest:
				return "The JSON sent is not a valid Request object."
			case RpcException.Code.MethodNotFound:
				return "The method does not exist / is not available."
			case RpcException.Code.InvalidParams:
				return "Invalid method parameter(s)."
			case RpcException.Code.InternalError:
				return "Internal JSON-RPC error."
			case RpcException.Code.ServerError:
				return "Server Error"
			default:
				return this.selectMessage(RpcException.Code.InternalError)
		}
	}
}
