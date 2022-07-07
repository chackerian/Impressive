const firebase = require("firebase");

const store = firebase.firestore()

const saveInstagramImages = async function(images, email) {
    try {
    store.collection('users').doc(email).update({
        instagram: images,
      })
    } catch {
        console.log("error while saving data")
    }
}

module.exports = {
    saveInstagramImages
}