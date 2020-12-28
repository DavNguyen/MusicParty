var apiKey = "AIzaSyDn7gn1uHjk-Egvmdj2ZV4SPGKeE1fzZ5k";
var arrQueue = [];
var isPlay = false;
var player;
var countStateUnstarted = 0;
var doubleNext = false;

function init() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load("youtube", "v3", function () {
        console.log('Youtube API already');
    });
}
