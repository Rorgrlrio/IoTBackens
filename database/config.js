require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB01eO4Mfgi6kTViqMpkHooACa-jDcikQs",
  authDomain: "air-check-ad25b.firebaseapp.com",
  projectId: "air-check-ad25b",
  storageBucket: "air-check-ad25b.appspot.com",
  messagingSenderId: "559173026735",
  appId: "1:559173026735:web:9578acfd9f9dbdaf0aa55a",
  measurementId: "G-R1BTDN9HPR"
};

const app = initializeApp(firebaseConfig);
const dbFirebase = getFirestore(app);

module.exports = {
    dbFirebase
}
