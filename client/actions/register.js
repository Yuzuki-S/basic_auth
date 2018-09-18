import request from '../utils/api'
import {receiveLogin} from './login'
import {saveUserToken} from '../utils/auth'

export const REGISTER_REQUEST = 'REGISTER_REQUEST'
export const REGISTER_FAILURE = 'REGISTER_FAILURE'

function requestRegister (creds) {  //the register request is received and state is set to thinking status.
  return {
    type: REGISTER_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
    //CREDS - this is the variable that holds the info entered into the form. we know this because the function on line 26 has that data -> assuming it's defined within react
}

export function registerError (message) {
  return {
    type: REGISTER_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

//NOTE - when using this code set, ross has made the server only accept data in object format. 
// CREDS must be an object. 
//if your'e using forms and want say req.body.name , req.body.gender etc, you must make it an object first. 
// e.g. let obj = {key: value, key: value} otherwise the server will reject it. this is just for this code however. 

export function registerUser (creds) {
  return dispatch => {
    // We dispatch requestRegister to kickoff the call to the API
    dispatch(requestRegister(creds))

    return request('post', '/register', creds)  //talking to the server here
      .then((response) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(registerError(response.body.message))
          return Promise.reject(response.body.message)
        } else {
          // If login was successful, set the token in local storage
          const userInfo = saveUserToken(response.body.token)
          // Dispatch the success action
          dispatch(receiveLogin(userInfo))
        }
      }).catch(err => {
        dispatch(registerError(err.response.body.message))
      })
  }
}
