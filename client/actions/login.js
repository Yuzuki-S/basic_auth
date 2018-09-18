import request from '../utils/api'
import {saveUserToken} from '../utils/auth'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function requestLogin () {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false
  }
}

export function receiveLogin (user) { //the server replied with a user object (user) like that, this has the users information.
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    user
  }
}

function loginError (message) { //this function only runs is the response from our server is an error with login
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

// basically the request login function above runs, it sets the fetching status to true, next, on line 44 we ask the server to do a post request to /signin. while this processes
// we will wait, once it's done, the function receive login on line 16, runs, this sets the users status to logged in (within redux). (is authenticated: true)

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser (creds) {  //this function is what the button will inititiate and this function can use 'return dispatch' to dispatch multiple actions. Such as request login and complete the login.
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return request('post', '/signin', creds)
      .then((response) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(response.body.message))
          return Promise.reject(response.body.message)
        } else {
          // If login was successful, set the token in local storage
          const userInfo = saveUserToken(response.body.token)
          // Dispatch the success action
          dispatch(receiveLogin(userInfo))
        }
      }).catch(err => dispatch(loginError(err.response.body.message)))
  }
}
