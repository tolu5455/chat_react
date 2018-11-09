import React, { Component } from 'react';
import '../style/Room.css'
import {startSendMessage} from '../action/chat'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
const firebase = require("firebase")

class Chat extends Component{
  constructor(){
    super()
    this.handleSend = this.handleSend.bind(this)
  }

  handleSend = (e) => {
    e.preventDefault();
    var user = this.props.uid
    var messageInput = e.target.message.value;
    
    var estimatedServerTimeMs = 0;
    var offsetRef = firebase.database().ref(".info/serverTimeOffset");
    offsetRef.on("value", function (snap) {
        var offset = snap.val();
        estimatedServerTimeMs = new Date().getTime() + offset;    
    });

        if (user && this.props.name !== undefined) {
            const uidSender = user.uid
            const uidReceiver = this.props.user
            
            // const displayName1 = user.displayName
            const displayName2 = this.props.name
            // const message1 = {
            //     uid: uidSender,
            //     displayName1,
            //     text: messageInput,
            //     createdAt: formattedTime
            // }
            const message2 = {
              uid: uidReceiver,
              displayName2,
              text: messageInput,
              createdAt: estimatedServerTimeMs
          }
           //firebase.database().ref(`users/${uidReceiver}/messageReceive/`).push(message1);
           firebase.database().ref(`users/${uidSender}/message/`).push(message2);
        }


    e.target.reset();
    
  }

    render(){
      var messageSend = [];
      var twoUsers = [];
      Object.keys(this.props.users).map(uid => {
        if(this.props.uid.uid === uid || uid === this.props.user){
          twoUsers.push(this.props.users[uid]);
      }
    })

    if(twoUsers !== []){
      twoUsers.map(user => {
        if(user.message !== undefined){
          Object.keys(user.message).map(id => {
            //console.log(user.message[id]);
            if(user.message[id].uid === this.props.user || this.props.uid.uid === user.message[id].uid){
              messageSend.push(user.message[id]);
            }
          })
        }   
      })
      
    }
    var message = messageSend.sort(function(a, b){return b.createdAt-a.createdAt});
    console.log(message);
    var result = [];
    Object.keys(message).map(id => {
      if(message[id].uid === this.props.user){

        result.unshift(
          <li className="clearfix" key={id}>
                  <div className="message-data align-right">
                      <span className="message-data-name" >{this.props.uid.displayName}</span> <i className="fa fa-circle me"></i>
                  </div>
                  <div className="message other-message float-right">
                    {message[id].text}
                    </div>
          </li>
        )
      } else {
        result.unshift(
          <li key={id}>
                  <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i>{this.props.name}</span>
                  </div>
                  <div className="message my-message">
                    {message[id].text}
                    </div>
                </li>
        );
      }     
    })
        return (
            <div className="chat">
            <div className="chat-header clearfix">
              <img src={this.props.avatar} alt="avatar" style={{width: '40px'}}/>

              <div className="chat-about">
                <div className="chat-with" style={{fontSize: 'bold'}}>{this.props.name}</div>
              </div>
              <i className="fa fa-star"></i>
            </div>

            <div className="chat-history">
              <ul>
                {result}
                {/* <li className="clearfix">
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
                    <span className="message-data-time">10:20 AM, Today</span>
                  </div>
                  <div className="message my-message">
                    Actually everything was fine. I'm very excited to show this to our team.
                    </div>
                </li> */}

              </ul>

            </div>

            <form className="chat-message clearfix" onSubmit={this.handleSend}>
              <textarea name="message" id="message-to-send" autoFocus placeholder="Type your message" rows="3"></textarea>
              <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
                <i className="fa fa-file-image-o"></i>

              <button type="submit">Send</button>

            </form>

          </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    uid: state.firebase.auth,
    users: state.firebase.data.users,
  }
}

const mapDispatchToProps = (dispatch) => ({
  startSendMessage: (message) => dispatch(startSendMessage(message))
})

export default compose(
  firebaseConnect((props) => [
    { path: 'users' }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(Chat)

