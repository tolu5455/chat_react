import { createStore, compose, applyMiddleware } from 'redux'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import { reduxFirestore } from 'redux-firestore'
import firebase from 'firebase/app'
import thunk from 'redux-thunk'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from '../config/base'
import { initialState, rootReducer } from '../reducer/reducer'

firebase.initializeApp(firebaseConfig)

const enhancers = [
    reactReduxFirebase(firebase, {
        userProfile: 'users',
        enableLogging: false,
    })
]

const composedEnhancers = compose(
    ...enhancers
)

const store = createStore(rootReducer, initialState, composedEnhancers)

export default store