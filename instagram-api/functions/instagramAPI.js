const axios = require("axios");
var qs = require('qs');

const instagramDataToArray = async function (data) {
    var images = []

    try {
        await data.data.forEach((image) => {
            if(image.media_url) images.push(image.media_url);
          })
    } catch {
        throw "some problem while turning the data into array"
    }

    return images;
}

const getUserData = async function(access_token) {
    let data = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${access_token}`)
    .catch((e) => { console.log("error while getting the userdata") })

    return data;
}

const getAccessToken = async function(code) {
    let finaldata;
    let access_token = await axios({
        method: 'POST',
        url: 'https://api.instagram.com/oauth/access_token',
        data: qs.stringify({
            client_id: '445757196713182',
            client_secret: "6155d32119fb02827420ea5917b9dcaf",
            grant_type: 'authorization_code',
            redirect_uri: "https://localhost:3000/auth/instagram/authenticate/",
            code: code
        })
    })
    .catch(err =>{
        console.log("error while getting the access_token");
    })

    try {
        await getUserData(access_token.data.access_token).then((response) => {
            finaldata = response.data;
        })
    } catch {
        console.log("an error happended")
    }

    return finaldata;

};

module.exports = {
    getAccessToken: getAccessToken,
    instagramDataToArray: instagramDataToArray
}