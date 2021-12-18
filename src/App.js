import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import Homepage from './views/Homepage'
import Signup from './views/Signup'
import Login from './views/Login'
import Detail from './views/Detail'
import Sellingpage from './views/Sellingpage'
import Editprofile from './views/Editprofile'
import { useState, useEffect } from 'react'
import { auth, db } from './config/firebase'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";



function App() {

  const [user, setUser] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid)
        if (uid) {
          setUser(true)
        }
        // ...
      } else {
        // User is signed out
        // ...
        console.log("user is signed out")
      }
    });
  }, [])




  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/editprofile">
            {ProtectedRoute(user, <Editprofile />)}
          </Route>
          <Route exact path="/sellingpage">
            {ProtectedRoute(user, <Sellingpage />)}
          </Route>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/detail/:adId">
            {ProtectedRoute(user, <Detail />)}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function ProtectedRoute(user, component, redirectTo = '/') {
  return user ? component : <Redirect to={redirectTo} />
}


export default App;
