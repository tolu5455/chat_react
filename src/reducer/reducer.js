import {combineReducers} from 'redux'
import {firebaseReducer} from 'react-redux-firebase'
import chatReducer from './chat'

export const initialState = {}

export const rootReducer = combineReducers({
    firebase: firebaseReducer,
    chat: chatReducer
})