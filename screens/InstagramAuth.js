console.log("INSTA AUTH")

window.onmessage = function (e) {
  if (e.data) {
    var codesent = e.data.data
    console.log(codesent)
  }
};

function gen(){
  var win = window.open("https://www.instagram.com/oauth/authorize/?app_id=445757196713182&redirect_uri=https://socially-b729a.web.app/&scope=user_profile,user_media&response_type=code", 'window', 'height=500,width=500')

  if (window.location.search.match(/.*code=([^&|\n|\t\s]+)/)[1]) {
    console.log("true")
    var code = window.location.search.match(/.*code=([^&|\n|\t\s]+)/)[1] || [];
    console.log("code", code)
    window.opener.postMessage(
        {
          type: "code",
          data: code
        },
        "*"
    );
    window.close()
  }
}

gen()

// const formData = new FormData();
// formData.append("app_id", '445757196713182');
// formData.append("app_secret", '6155d32119fb02827420ea5917b9dcaf');
// formData.append("redirect_uri", 'https://socially-b729a.web.app/');
// formData.append("code", code);
// formData.append("grant_type", "authorization_code");

// fetch(
//   "https://api.instagram.com/oauth/access_token",
//   {
//     method: "POST",
//     body: formData
//   }
// );

// fetch("https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=IGQVJXMGZAETDBNMkRSNElMRTI2VVVCQWJKVU8wanA4ME1va28wUVZA1RktJa05Vdkt3ZAnYwdElRNjFaX3VGd0hrLTNkU3pHS2JpSm40V040QnBtSm1kLWpkMEYtdktTbUVicjRTQnlVMS1KbE9uWGgtaDVBZAnRkRjZAhQzNv").then((response) => {
//    return response.json()
// }).then((response) => {
//    console.log(response.data)
// })