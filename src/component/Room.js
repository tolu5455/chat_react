import React, { Component } from 'react';
import '../style/Room.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

const firebase = require("firebase")
require("firebase/firestore")

class Room extends Component {

  render() {

    if (!isLoaded(this.props.users)) {
      return <div>Loadding...</div>
    }
    if (isEmpty(this.props.users)) {
      return <div>No user</div>
    }
    let userList = []
    var estimatedServerTimeMs = 0;
    var amOnline = firebase.database().ref('.info/connected');
    var userRef = firebase.database().ref('users/' + this.props.uid.uid + '/connections');
    amOnline.on('value', function (snapshot) {
      if (snapshot.val()) {
        var offsetRef = firebase.database().ref(".info/serverTimeOffset");
        offsetRef.on("value", function (snap) {
          var offset = snap.val();
          estimatedServerTimeMs = new Date().getTime() + offset;
        });
        var date = new Date(estimatedServerTimeMs);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        userRef.onDisconnect().set("last online " + formattedTime);
        userRef.set("online")
      }
    });
    for (var user in this.props.users) {
      userList.push(
        <li className="clearfix" key={this.props.users[user].displayName}>
          <img src={this.props.users[user].avatarUrl} alt="avatar" style={{ width: "40px" }} />
          <div className="about">
            <div className="name">{this.props.users[user].displayName}</div>
            <div className="status">
              <i>{this.props.users[user].connections}</i>
            </div>
          </div>
        </li>)
    }
    return (
      <div>
        <div className="container clearfix">
          <div className="people-list" id="people-list">
            <div className="search">
              <input type="text" placeholder="search" />
              <i className="fa fa-search"></i>
            </div>
            <ul className="list">
              {userList}
            </ul>
          </div>
          <div className="chat">
            <div className="chat-header clearfix">
              <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg" alt="avatar" />

              <div className="chat-about">
                <div className="chat-with">Chat with Vincent Porter</div>
                <div className="chat-num-messages">already 1 902 messages</div>
              </div>
              <i className="fa fa-star"></i>
            </div>

            <div className="chat-history">
              <ul>
                <li className="clearfix">
                  <div className="message-data align-right">
                    <span className="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
                      <span className="message-data-name" >Olia</span> <i className="fa fa-circle me"></i>

                  </div>
                  <div className="message other-message float-right">
                    Hi Vincent, how are you? How is the project coming along?
                    </div>
                </li>

                <li>
                  <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i> Vincent</span>
                    <span className="message-data-time">10:12 AM, Today</span>
                  </div>
                  <div className="message my-message">
                    Are we meeting today? Project has been already finished and I have results to show you.
                    </div>
                </li>

                <li className="clearfix">
                  <div className="message-data align-right">
                    <span className="message-data-time" >10:14 AM, Today</span> &nbsp; &nbsp;
                      <span className="message-data-name" >Olia</span> <i className="fa fa-circle me"></i>

                  </div>
                  <div className="message other-message float-right">
                    Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?
                    </div>
                </li>

                <li>
                  <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i> Vincent</span>
                    <span className="message-data-time">10:20 AM, Today</span>
                  </div>
                  <div className="message my-message">
                    Actually everything was fine. I'm very excited to show this to our team.
                    </div>
                </li>

                <li>
                  <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i> Vincent</span>
                    <span className="message-data-time">10:31 AM, Today</span>
                  </div>
                  <i className="fa fa-circle online"></i>
                  <i className="fa fa-circle online" style={{ color: "#AED2A6" }}></i>
                  <i className="fa fa-circle online" style={{ color: "#DAE9DA" }}></i>
                </li>

              </ul>

            </div>

            <div className="chat-message clearfix">
              <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3"></textarea>

              <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
                <i className="fa fa-file-image-o"></i>

              <button>Send</button>

            </div>

          </div>

        </div>
      </div>

    )
  }
}

export default compose(
  firebaseConnect((props) => [
    { path: 'users' }
  ]),
  connect((state, props) => ({
    uid: state.firebase.auth,
    users: state.firebase.data.users
  }))
)(Room)