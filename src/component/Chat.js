import React, { Component } from 'react';
import '../style/Room.css'
import {startSendMessage} from '../action/chat'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import Dropzone from 'react-dropzone'
import UploadImage from './UploadImage';
const firebase = require("firebase")
const imageExists = require('image-exists');

class Chat extends Component{
  constructor(props){
    super(props)
    this.handleSend = this.handleSend.bind(this)
    this.checkImg = this.checkImg.bind(this)
    this.getImage = this.getImage.bind(this)
    this.handleDisplay = this.handleDisplay.bind(this)
    this.state = {
      isImg: false,
      messageIn: '',
      displayL: '',
      displayImg: 'none'
    }
  }

  scrollToBottom = (options) => {
    this.messageEnd.scrollIntoView(options);
  }

  componentDidMount(){
    this.scrollToBottom(false);
  }

  // componentDidUpdate(){
  //   this.scrollToBottom({block: 'end', behavior: "smooth"});
  // }

  checkImg = (img) => {
    const current = this
    imageExists(img, function(exists) {
      if (exists) {
        current.setState({isImg: true})
      }
      else {
        current.setState({isImg: false})
      }
    });
  }

  handleSend = (e) => {
    e.preventDefault();
    var user = this.props.uid
    var isImg = false;
    if(e.target.file.files.length !== 0){
      isImg = true;
    }  else{
      imageExists(this.state.messageIn, function(exists) {
        if (exists) {
          isImg = true
        }
        else {
          isImg = false
        }
      });
      this.setState({messageIn: e.target.message.value});
    }
    if (this.state.messageIn !== '') {
      var estimatedServerTimeMs = 0;
      var offsetRef = firebase.database().ref(".info/serverTimeOffset");
      offsetRef.on("value", function (snap) {
        var offset = snap.val();
        estimatedServerTimeMs = new Date().getTime() + offset;
      });

      if (user && this.props.name !== undefined) {
        
        const uidSender = user.uid
        const uidReceiver = this.props.user
        const displayName2 = this.props.name
        const message2 = {
          uid: uidReceiver,
          displayName2,
          text: this.state.messageIn,
          isImage: isImg,
          createdAt: estimatedServerTimeMs,
          
        }
        const message3 = {
          uid: uidSender,
          lastTime: estimatedServerTimeMs
        }
        //firebase.database().ref(`users/${uidReceiver}/lastTime/`).push(message3)
        firebase.database().ref(`users/${uidSender}/message/`).push(message2);
      }
      e.target.reset();
    }
  }

  getImage(e){
    var image = e.target.files;
    var imgReader = new FileReader()
    imgReader.readAsDataURL(image[0])
    imgReader.onload = e =>{
    this.setState({messageIn: e.target.result})
    }
  }

  handleDisplay(){
    if(this.state.display === ''){
      this.setState({display: 'none', displayImg: ''})
    } else {
      this.setState({display: '', displayImg: 'none'})
    }
    
  }

    render(){

      var isValid = false;
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
            if(user.message[id].uid === this.props.user || this.props.uid.uid === user.message[id].uid){
              messageSend.push(user.message[id]);
            }
          })
        }   
      })
    }
    var message = messageSend.sort(function(a, b){return b.createdAt-a.createdAt});
    var result = [];
    Object.keys(message).map(id => {
      imageExists(message[id].text, function(exists) {
        if (exists) {
          isValid = true
        }
        else {
          isValid = false;
        }
      });
      if(message[id].uid === this.props.user && message[id].isImage === true){
        isValid = false;
        result.unshift(
          <li className="clearfix" key={id}>
                  <div className="message-data align-right">
                      <span className="message-data-name" >{this.props.uid.displayName}</span> <i className="fa fa-circle me"></i>
                  </div>
                  <div className="message other-message float-right">
                  <img style={{width: '150px'}} src={message[id].text} alt="img"/>
                    </div>
          </li>
        )
      } else if(message[id].uid === this.props.user && message[id].isImage === false){
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
      } else 
      if(message[id].uid !== this.props.user && message[id].isImage === true){
        isValid = false;
        result.unshift(
          <li key={id}>
                  <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i>{this.props.name}</span>
                  </div>
                  <div className="message my-message">
                  <img style={{width: '150px'}} src={message[id].text} alt="img"/>
                    </div>
                </li>
        );       
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
                <li ref={(el) => {this.messageEnd = el;}}></li>
              </ul>

            </div>      
            <button onClick={this.handleDisplay} style={{marginTop: '15px', marginLeft: '15px'}} >Send Image</button>      
            {/* <button disabled={this.props.user !== undefined ? false : true} style={{marginTop: '15px', marginLeft: '15px'}} onClick={this.dropZoneHandle}>Share image</button> */}
            <form className="chat-message clearfix" onSubmit={this.handleSend}>           
              <textarea name="message" id="message-to-send" autoFocus placeholder="Type your message" rows="3" 
                  onChange={e => this.setState({messageIn: e.target.value})} style={{display: this.state.display}}></textarea>
              <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
              <i className="fa fa-file-image-o"></i>
              <input type="file" name="file" onChange={(e) => this.getImage(e)} style={{display: this.state.displayImg}}/>                              
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

