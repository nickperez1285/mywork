import {
	GET_LOCATION_START,
	GET_LOCATION_SUCCESS,
	GET_LOCATION_FAIL,
} from '../actions'

export const initState = {
	zip: '',
	lat: '',
	lng: '',
	error: '',
	isFetching: false,
}

export const locationReducer = (state = initState, action) => {
	switch (action.type) {
		case GET_LOCATION_START:
			return {
				...state,
				error: '',
				isFetching: true,
			}
		case GET_LOCATION_SUCCESS:
			return {
				...state,
				error: '',
				isFetching: false,
				_geoloc: {
					lat: action.payload.results[0].geometry.location.lat,
					lng: action.payload.results[0].geometry.location.lng,
				},
				zip: action.payload.results[0].address_components[0].long_name,
			}

		case GET_LOCATION_FAIL:
			return {
				...state,
				error: action.payload,
				isFetching: false,
			}
		default:
			return state
	}
}
