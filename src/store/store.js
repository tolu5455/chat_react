import { createStore, compose, applyMiddleware } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import thunk from 'redux-thunk'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from '../config/base'
import { initialState, rootReducer } from '../reducer/reducer'

firebase.initializeApp(firebaseConfig)

const enhancers = [
    reactReduxFirebase(firebase, {
        userProfile: 'users',
        enableLogging: false,
    }), applyMiddleware(thunk)
]

const composedEnhancers = compose(
    ...enhancers
)

const store = createStore(rootReducer, initialState, composedEnhancers)

export default store