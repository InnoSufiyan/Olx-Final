import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./App.css";
import coverImage from "../../images/cover.PNG";
import coverFooter from "../../images/footcover.PNG";
import Adcard from "../../Component/Adcard";
import Navbar from "../../Component/Navbar";
import NavbarLoggedIn from "../../Component/NavbarLoggedIn";
import Navbar2 from "../../Component/Navbar2";

import { auth, storage, db } from "../../config/firebase";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc 
} from "firebase/firestore";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConstructionOutlined } from "@mui/icons-material";

export default function Editprofile() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const [fullName, setfullName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState();

  const history = useHistory();



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);

        localStorage.setItem("userUid", JSON.stringify(uid))


        if (uid) {
          setUserLoggedIn(true);

          const docRef = doc(db, "users", uid);
          const docSnap = getDoc(docRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserDetails(docSnap.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // ...
      } else {
        // User is signed out
        // ...
        console.log("user is signed out");
      }
    });
  }, [userLoggedIn]);

  const submitHandler = async () => {

    console.log("image>>>", image)
    const localStorageUid = JSON.parse(localStorage.getItem('userUid'))
    console.log(localStorageUid)

    const storageRef = ref(storage, `profilePic/${localStorageUid}/${image[0].name}`);


   
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, image[0])
    const url = await getDownloadURL(storageRef)
    console.log(url)
    const userEditedProfile = {
      fullName,
      phone,
      image: url
    }

    const docRef = doc(db, "users", localStorageUid)
    await updateDoc(docRef, userEditedProfile
    );
    history.push('/')
  }

  function changeUser() {
    setUserLoggedIn(false);
  }

  return (
    <>
      {userLoggedIn ? (
        <NavbarLoggedIn
          userDetails={userDetails}
          changeUser={() => changeUser()}
        />
      ) : (
        <Navbar />
      )}
      <Navbar2 />
      <div id="container">
        <div className="form-wrap">
          <h1>Edit Profile</h1>
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
              <label for="profilepic">Profile Pic</label>
              <input
                type="file"
                name="profilepic"
                id="profilepic"
                onChange={(e) => setImage(e.target.files)}
              />
            </div>

            <button type="submit" onClick={submitHandler} className="btn">
              Edit Profile
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
