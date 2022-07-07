const express = require('express');

const router = express.Router();

const { saveInstagramImages } = require("../functions/firebase");
const { getAccessToken, instagramDataToArray } = require("../functions/instagramAPI");

router.use((req, res, next) => {
  let origin = req.headers.referer

  if(origin == "http://localhost:19006/" || origin == "https://l.instagram.com/") {
    next()
  } else {
    res.send("Not authorized")
  }
})

router.get("/", (req, res) => {
    let email = req.query.email;
    if(!email) return res.sendStatus(404);

    res.cookie('email', email).redirect("https://www.instagram.com/oauth/authorize/?app_id=445757196713182&redirect_uri=https://localhost:3000/auth/instagram/authenticate/&scope=user_profile,user_media&response_type=code")
})

router.get("/authenticate", async (req, res) => {
    let code = req.query.code;
    let email = req.cookies.email;

    try {
      getAccessToken(code).then(async (response) => {
        let imageArray = await instagramDataToArray(response);
        saveInstagramImages(imageArray, email);
      })
    } catch {
      console.log("error while axicuting the getAccessToken functions")
    }

    res.redirect("http://localhost:19006")
  })

  module.exports = router;