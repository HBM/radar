
let connecting = false

const config = (state = {}, action) => {
		switch(action.type) {
				case 'CONNECT_REQUEST':
						connecting = true
						return state
				case 'CONNECT_SUCCESS':
						connecting = false
						return {
						...state,
						url: action.url,
						user: action.user,
						password: password
				}
				case: 'CONNECT_FAILURE':
						connecting: false
						return {
								...state,
								url: action.url,
								error: action.message
						}
		}
}

export const getIsConnecting = () => connecting

export default config
