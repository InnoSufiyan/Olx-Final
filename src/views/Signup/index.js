import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { auth, db } from '../../config/firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";


export default function Signup() {

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const history = useHistory();

  function submitHandler () {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        phone,
        password,
        uid: user.uid
      })
      .then(()=> {
        console.log("Data saved")
        history.push('/login')
      }).catch((e) => {
        console.log(e)
      })
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      setError(errorCode, errorMessage)
      // ..
    });
  }

  return (
    <>
      <div id="container">
        <div className="form-wrap">
          <h1>Sign Up</h1>

          <p>It's free and take a minute only</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label for="fullName">Full Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="e.g:Bill"
                onChange={(e) => setfullName(e.target.value)}
              />
            </div>

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
              <label for="phone">Phone</label>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="032222222"
                onChange={(e) => setPhone(e.target.value)}
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
              Signed Up
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
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
