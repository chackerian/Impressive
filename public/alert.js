alert("test")
var code = window.location.search.match(/.*code=([^&|\n|\t\s]+)/)[1] || [];
console.log("code", code)
window.opener.postMessage(
        {
          type: "code",
          data: code
        },
        "*"
);