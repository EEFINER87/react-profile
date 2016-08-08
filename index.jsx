
require("!style!css!sass!./src/style.sass");

import React from 'react';
import ReactDom, { render } from 'react-dom';

//This resizes the image and makes an data URL to store the image in local storage
function getImage(img) {
    var canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 100, 100);
    
    var dataURL = canvas.toDataURL("image/jpg");
    
    return dataURL
}

class PanelDisplay extends React.Component {
  render() {
    const user = this.props.user
    return (
      <div>
        <div className="content-left">
          <img src={user.avatar}/>
        </div>
        <div className="content">
          <span className="username">{user.username}</span>
          <div>
            <a href={"mailto:" + user.email} target="_blank">
              <i className="fa fa-envelope-o"></i>
              Contact
            </a>
          </div>
          <div>
            <a href="#" data-follow={user.username}>
              <i className="fa fa-plus-circle"></i>
              Follow
            </a>
          </div>
          <div>
            <a href={"https://twitter.com/" + user.twitter} target="_blank">
              <i className="fa fa-twitter"></i>
              @{user.twitter}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class EditDisplay extends React.Component {
  handleChange(key) {
    return function(e){
      let value = e.target.value;
      this.props.onUserInput(key, value);
    }.bind(this);
  }
  handleImageChange() {
    return function(e){
      let file = e.target.files[0];
      let avatar = document.getElementById('avatar');
      if (file.type.indexOf('image') < 0) {
        document.getElementById('imageError').innerHTML = 'Invalid File Type. Please choose an Image.';
        return;
      }
      let imageReader = new FileReader();
      imageReader.onload = function() {
        avatar.src = imageReader.result;
        this.props.onUserInput('avatar', getImage(avatar));
      }.bind(this);
      imageReader.readAsDataURL(file);
    }.bind(this);
  }
  render() {
    const user = this.props.user;
    return(
      <div>
        <form>
          <div className="content-left">
            <img id="avatar" src={user.avatar}/>
          </div>
          <div className="content">
            <div>
              <label htmlFor="username">username</label>
              <input onChange={this.handleChange('username')} type="text" name="username" label="username" value={user.username}/>
            </div>
            <div>
              <label htmlFor="email">email</label>
              <input onChange={this.handleChange('email')} type="text" name="email" label="email" value={user.email}/>
            </div>
            <div>
              <label htmlFor="twitter">twitter</label>
              <input onChange={this.handleChange('twitter')} type="text" name="twitter" label="twitter" value={user.twitter}/>
            </div>
          </div>
          <input onChange={this.handleImageChange()} name="avatar" type="file" id="editAvatar"/>
          <div id="imageError"></div>
        </form>
      </div>
    );
  }
}

class EditButton extends React.Component {
  render(){
    const text = this.props.editing ? 'Save' : 'Edit';
    return (
      <div className="editBtn" onClick={this.props.handleEditClick.bind(this)}>
        <i className="fa fa-pencil"></i> {text}
      </div>
    );
  }
}

//parent component
class Profile extends React.Component {
  constructor(){
    let userData;
    // I think of this as simulating data received from server after a user logs in.
    if (localStorage.getItem("reactProfileUser") === null) {
      userData = {"username": "NothingFiner", "email": "e.a.finer@gmail.com", "twitter": "antistatistcat", "avatar": "src/profile.jpg"}
    } else {
      userData = JSON.parse(localStorage.getItem("reactProfileUser"));
    }
    super();
    this.state = {
      editing: false,
      user: userData
    };
  }
  render() {
    let display;
    if (this.state.editing) {
      display = <EditDisplay user={this.state.user} onUserInput={this.handleProfileUpdate.bind(this)}/>;
    }
    else {
      display = <PanelDisplay user={this.state.user}/>;
    }
    return (
      <div className="profilePanel">
        {display}
        <EditButton handleEditClick={this.handleEditClick.bind(this)} editing={this.state.editing}/>
      </div>
    );
  }
  handleEditClick(){
    this.setState({editing: !this.state.editing});
    if (this.state.editing) {
      console.log(this.state.user);
      //Answer 1: this is where a user's data is saved into localStorage
      localStorage.setItem("reactProfileUser", JSON.stringify(this.state.user));
    }
  }
  handleProfileUpdate(key, value) {
    let profileUserState = this.state.user;
    profileUserState[key] = value;
    this.setState({
      user: profileUserState
    });
  }
}


render(
  <Profile/>,
  document.getElementById('root')
);