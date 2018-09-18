import {removeUser} from '../utils/auth'

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

function requestLogout () { //user wants to logout so we'll wait for our server to do this
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout () {  //user is no longer authenticated
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

// Logs the user out
export function logoutUser () { //when user clicks logout
  return dispatch => {
    dispatch(requestLogout())  //we will dispatch this action which is above
    removeUser()  //delete their access token
    dispatch(receiveLogout())  //next we will actually say yep they're logged out
  }
}
