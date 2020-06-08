import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    photo : ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      //console.log(res);
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
    //console.log(res);
  }

  const handleSignOut = ()=> {
    firebase.auth().signOut()
    .then(res => {
       const signedOutUser = {
        isSignedIn : false,
        name : '',
        email : '',
        photo : '',
        password : '',
        error : '',
        isValid : false,
        existingUser: false
       }
       setUser(signedOutUser);
    })
    .catch(err => {

    })
    //console.log("Sign out clicked");
  }
 
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    //debugger;
    //perform validation
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name === 'password'){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    //console.log(e.target.name);
    
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    //console.log(e.target.name, e.target.value);
  }

  const createAccount = (event)=> {
    if(user.isValid){
      //console.log(user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    // else {
    //   console.log("Email or Password is not valid", {Email: user.email, Pass: user.password});
    // }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if(user.isValid){
      //console.log(user.email, user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick= {handleSignOut}>Sign out</button> :
        <button onClick= {handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
        <div>
            <p>Welcome, {user.name}</p>
            <p>Your email: {user.email}</p>
            <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Owr Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id= "switchForm"/>
      <label htmlFor="switchForm"> Returning User</label>
      {/* Sign In */}
      <form style={{display:user.existingUser ? 'block': 'none'}} onSubmit={signInUser}>
        <input type="text" onChange={handleChange} name="email" placeholder="Enter your Email" required/>
        <br/>
        <input type="password" onChange={handleChange} name="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Sign in"/>
      </form>

      {/* Sign Up */}
      <form style={{display:user.existingUser ? 'none': 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Enter your Name" required/>
        <br/>
        <input type="text" onChange={handleChange} name="email" placeholder="Enter your Email" required/>
        {/* <input type="text" onBlur={handleChange} name="email" placeholder="Enter your Email"/> */}
        <br/>
        <input type="password" onChange={handleChange} name="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style= {{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
