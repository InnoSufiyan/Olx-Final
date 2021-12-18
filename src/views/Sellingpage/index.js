import "./App.css";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Navbar from "../../Component/Navbar";
import NavbarLoggedIn from "../../Component/NavbarLoggedIn";
import Navbar2 from "../../Component/Navbar2";

import { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

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
  updateDoc,
} from "firebase/firestore";

import { useHistory } from "react-router-dom";

export default function Sellingpage() {
  const history = useHistory();

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const [brandName, setBrandName] = useState("");
  const [yearOfPurchase, setyearOfPurchase] = useState("");
  const [model, setmodel] = useState("");
  const [physicalCondition, setphysicalCondition] = useState("");
  const [adTitle, setadTitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [location, setlocation] = useState("");
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);

        localStorage.setItem("userUid", JSON.stringify(uid));

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
    console.log("submit Handler clicked");
    console.log(
      brandName,
      yearOfPurchase,
      model,
      physicalCondition,
      adTitle,
      description,
      price,
      location,
      image
    );

    const localStorageUid = JSON.parse(localStorage.getItem("userUid"));
    console.log(localStorageUid);

    const multipleImages = [];
    console.log(`image ==> ${image}`);
    for (let i = 0; i < image.length; i++) {
      const storageRef = ref(storage, image[i].name);
      await uploadBytes(storageRef, image[i]);
      const url = await getDownloadURL(storageRef);
      console.log("Uploaded a blob or file!");
      multipleImages.push(url);
    }

    console.log(multipleImages);
    const newDoc = {
      brandName,
      yearOfPurchase,
      model,
      physicalCondition,
      adTitle,
      description,
      price,
      location,
      category,
      image: multipleImages,
      adminUid: localStorageUid,
    };
    const docRef = await addDoc(collection(db, "add"), newDoc);
    console.log(newDoc);
    history.push("/");
    // console.log("Document written with ID: ", docRef.id);
  };

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
          <h1>Post Ad</h1>

          <p>Include Ad Details</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="d-flex justify-content-between">
              <div>
                <div className="form-group">
                  <label for="brandName">Brand Name</label>
                  <input
                    type="text"
                    name="brandName"
                    id="brandName"
                    placeholder="e.g: Brand Name"
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label for="yearOfPurchase">Year of Purchase</label>
                  <input
                    type="text"
                    name="yearOfPurchase"
                    id="yearOfPurchase"
                    placeholder="2021"
                    onChange={(e) => setyearOfPurchase(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label for="model">Model</label>
                  <input
                    type="text"
                    name="model"
                    id="model"
                    placeholder="Model"
                    onChange={(e) => setmodel(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label for="physicalCondition">Physical Condition</label>
                  <input
                    type="text"
                    name="physicalCondition"
                    id="physicalCondition"
                    placeholder="e.g:Hard One"
                    onChange={(e) => setphysicalCondition(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label for="adTitle">Ad Title</label>
                  <input
                    type="text"
                    name="adTitle"
                    id="adTitle"
                    placeholder="e.g:Hard One"
                    onChange={(e) => setadTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label for="description">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="e.g:Hard One"
                    onChange={(e) => setdescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label for="price">Price</label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    placeholder="e.g:Hard One"
                    onChange={(e) => setprice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label for="location">Location</label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="e.g:Hard One"
                    onChange={(e) => setlocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="Cars">Olx Autos (Cars)</MenuItem>
                    <MenuItem value="Properties">Properties</MenuItem>
                    <MenuItem value="Mobiles">Mobiles and Tablets</MenuItem>
                    <MenuItem value="Furniture">Furniture</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                    <MenuItem value="Books">Books</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="form-group">
              <label for="image">Upload Pictures</label>
              <input
                type="file"
                name="image"
                id="image"
                placeholder="image"
                onChange={(e) => setImage(e.target.files)}
                multiple
              />
            </div>

            <button type="submit" onClick={submitHandler} className="btn">
              Post Ad
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
