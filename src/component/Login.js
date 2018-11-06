import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Room from './Room';
import { GoogleLoginButton } from 'react-social-login-buttons'

const firebase = require("firebase")

class Login extends Component {
    static propTypes = {
        auth: PropTypes.object,
        firebase: PropTypes.shape({
            login: PropTypes.func.isRequired,
            logout: PropTypes.func.isRequired
        })
    }

    render() {
        if (!isLoaded(this.props.auth)) {
            return null
        }
        if (isEmpty(this.props.auth)) {
            return (
                <div>
                    <GoogleLoginButton style={{ width: "300px" }}
                        onClick={() => this.props.firebase.login({ provider: 'google', type: 'redirect' })}
                    >Log in with Google</GoogleLoginButton>
                </div>
            )
        }
        return (
            <div>
                <button onClick={() => {
                    firebase.database().goOffline();
                    this.props.firebase.logout()
                }
                }> Logout</button >
                <Room />
            </div>

        )
    }
}

export default compose(
    firebaseConnect(),
    connect(({ firebase: { auth } }) => ({ auth }))
)(Login)