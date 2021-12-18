import './App.css';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { auth, db } from '../../config/firebase'
import { useHistory } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";




export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, seterror] = useState("")



  const history = useHistory();

  const submitHandler = async () => {
    console.log("submit Handler clicked")
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.uid)
        history.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        seterror(errorCode, errorMessage)
      });
  }


  return (
    <>
      <div id="container">
        <div className="form-wrap">
          <h1>Login</h1>

          <p>It's free and take a minute only</p>
          <form onSubmit={e => e.preventDefault()}>


            <div className="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="abc@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="e.g:Hard One"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p>{error}</p>

            <button type="submit" onClick={submitHandler} className="btn">
              Login
            </button>
            <p className="bottom-text">
              By clicking the Sign Up button, you agree to our{" "}
              <a href="#">Terms & Conditions</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </form>
        </div>
        <footer>
          <p style={{color: "black"}}>
            Dont Have any Account
            <Link to="/signup"> Signup</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
