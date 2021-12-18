import image from "../../images/car.jpg";
import "./App.css";

import Imagegallery from "../../Component/Imagegallery";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Button, CardActionArea, CardActions } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { useParams } from "react-router-dom";

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

import Navbar from "../../Component/Navbar";
import NavbarLoggedIn from "../../Component/NavbarLoggedIn";
import Navbar2 from "../../Component/Navbar2";

import { useEffect, useState } from "react";

export default function Detail() {
  const { adId } = useParams();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [singleAd, setsingleAd] = useState();
  const [admin, setAdmin] = useState();

  const IMAGES = [
    {
      src: {image},
      thumbnail:
        {image},
      thumbnailWidth: 320,
      thumbnailHeight: 174,
      isSelected: true,
      caption: "After Rain (Jeshu John - designerspics.com)",
    }
  ];

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
  }, [userLoggedIn]);

  useEffect(() => {
    const docRef = doc(db, "add", adId);
    const docSnap = getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setsingleAd(docSnap.data());

          const adminRef = doc(db, "users", docSnap.data().adminUid);
          const adminSnap = getDoc(adminRef)
            .then((adminSnap) => {
              if (adminSnap.exists()) {
                console.log("Admin data:", adminSnap.data());
                setAdmin(adminSnap.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

      <div className="container d-flex justify-content-between w-100">
        <div
          style={{ height: "500px", minWidth: "500px" }}
          className="d-flex align-items-center"
        >
          <img src={singleAd?.image[0]}/>
        </div>
        <div
          style={{ height: "500px", maxWidth: "500px" }}
          className="d-flex flex-column justify-content-around"
        >
          <h1 style={{ color: "black" }}>{singleAd?.adTitle}</h1>
          <div className="d-flex">
            <div>
              <h4>Ad Details</h4>
              <h4>Brand Name</h4>
              <h4>Year of Purchase</h4>
              <h4>Model</h4>
              <h4>Physical Condition</h4>
            </div>
            <div>
              <h4>Description</h4>
              <h4>{singleAd?.brandName}</h4>
              <h4>{singleAd?.yearOfPurchase}</h4>
              <h4>{singleAd?.model}</h4>
              <h4>{singleAd?.physicalCondition}</h4>
            </div>
          </div>
        </div>
        <div
          style={{ height: "500px" }}
          className="d-flex flex-column align-items-between justify-content-around"
        >
          <div>
            <Box sx={{ minWidth: 275 }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {singleAd?.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {singleAd?.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Typography variant="body2" color="text.secondary">
                  {singleAd?.location}
                </Typography>
              </Card>
            </Box>
          </div>
          <div>
            <Box sx={{ minWidth: 275 }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                      Seller Description
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {admin?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {admin?.phone}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    {admin?.email}
                  </Button>
                </CardActions>
              </Card>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
