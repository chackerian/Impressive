const fs = require("fs");
const cors = require("cors");
const https = require("https");
const express = require('express');
const firebase = require("firebase");
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
const cert = fs.readFileSync("./instagram-api/localhost.pem");
const key = fs.readFileSync("./instagram-api/localhost-key.pem");

app.use(cors());
app.use(cookieParser());

// firebase stuff
var firebaseConfig = {
  apiKey: "AIzaSyDLeiyd8iai6akLcumpP5-A1yxs7t5wflk",
  authDomain: "socially-b729a.firebaseapp.com",
  databaseURL: "https://socially-b729a-default-rtdb.firebaseio.com",
  projectId: "socially-b729a",
  storageBucket: "socially-b729a.appspot.com",
  messagingSenderId: "804187430311",
  appId: "1:804187430311:web:6dad7a05a011fb3a032a82",
  measurementId: "G-P1NKXT7943"
};

firebase.initializeApp(firebaseConfig)
const store = firebase.firestore()

// routing
app.use("/auth/instagram", require("./routes/instagram.auth"));

// creating and listening to PORT
https.createServer({key: key, cert: cert }, app).listen(port, () => { console.log(`listening on ${port}`) });
//app.listen(port)

// exporting
module.exports = {
  store: store
}