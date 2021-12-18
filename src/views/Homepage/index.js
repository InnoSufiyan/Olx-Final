import "./App.css";
import coverImage from "../../images/cover.PNG";
import coverFooter from "../../images/footcover.PNG";
import Adcard from "../../Component/Adcard";
import Navbar from "../../Component/Navbar";
import NavbarLoggedIn from "../../Component/NavbarLoggedIn";
import Navbar2 from "../../Component/Navbar2";

import { auth, db } from "../../config/firebase";

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
  query,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);
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
    const q = query(collection(db, "add"));

    const querySnapshot = await getDocs(q);
    const currentAds = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      currentAds.push({...doc.data(), id:doc.id});
    });
    setPosts(currentAds);
  }, [userLoggedIn]);

  useEffect(async () => {});

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
      <div className="coverImage">
        <img src={coverImage} alt="" />
      </div>
      <div className="container firstLine">
        <h2>More on Cars</h2>
        <div className="firstLineProducts d-flex">
          {posts.map((post) => {
            return post.category == "Cars" ? <Adcard post={post} /> : "";
          })}
        </div>
      </div>
      <div className="container mt-5 firstLine">
        <h2>More on Phones</h2>
        <div className="firstLineProducts d-flex">
          {posts.map((post) => {
            return post.category == "Mobiles" ? <Adcard post={post} /> : "";
          })}
        </div>
      </div>
      <div className="container mt-5 firstLine">
        <h2>Fresh Recommendation</h2>
        <div className="firstLineProducts d-flex flex-wrap">
          {posts.map((post) => {
            return <Adcard post={post} />;
          })}
        </div>
      </div>
      <div className="coverImage">
        <img src={coverFooter} alt="" />
      </div>
    </>
  );
}
