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

// event enter input tag
$('#keyword').keypress(function(e) {
    if (e.which == 13) {
        search($("#keyword").val());
    }
});

function search(keyword) {
    console.log(keyword);
    $( "#searchBox" ).submit(function(event) {
        event.preventDefault();
        $.get(
            "https://www.googleapis.com/youtube/v3/search", {
                part: 'snippet,id',
                q: keyword,
                maxResults: 50,
                type: 'video',
                key: apiKey
            },
            function(data) {
                // clear list search
                $('#resultSearch').html("");


                var content = "";
                for (var i = 0; i < data.items.length; i++) {
                    if (data.items.length > 0) {
                        content = content + getResults(data.items[i]);
                    }
                }

                // show list video search
                $('#resultSearch').append(content);

                // call when click add button
                $(".add").click(function(){
                    // get index item in list search when click add button
                    var index = $(this).parent().index();
                    // add video clicked above to play
                    addVideoToPlay(data.items[index]);
                    // remove item selected in list search
                    $(this).parent().remove();
                    // remove element data2 array
                    data.items.splice(index, 1);
                })

            });
    });
}

// return item search
function getResults(item) {
    // get properties of item
    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var output =
        "<div class='item-video item-search'>" +
            "<img class='thumb' src='" + thumb + "'>" +
            "<div>" +
                "<p class='title'>" + title + "</p>" +
                "<p class='channelTitle'>" + channelTitle + "</p>" +
            "</div>" +
            "<button class='add' >Add</button>" +
        "</div>";
    return output;
}

function addVideoToPlay(item) {
    console.log("hele");
    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;

    if (isPlay == false) {
        isPlay = true;
        localStorage.clear();
        localStorage.setItem("LOCAL", "[]");

        play(videoID);

    } else {
        $("#title-queue").text("Play list")

        // get duration video added to queue
        var url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + apiKey + "&part=snippet,contentDetails";
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    var durationR = convert_time(data.items[0].contentDetails.duration);
                    var duration = convertT(durationR);
                    addVideoToQueue(videoID, title, thumb, duration, channelTitle);
                }
            }
        });
    }
}

function addVideoToQueue(videoID, title, thumb, duration, channelTitle) {
    var output =
        "<div class='item-video item-queue'>" +
            "<img class='thumb' src='" + thumb + "'>" +
            "<div>" +
                "<p class='title'>" + title + "</p>" +
                "<p class='channelTitle'>" + channelTitle + "</p>" +
                "<p class='len'>" + duration + "</p>" +
            "</div>" +
            "<button class='play' id= '" + videoID + "'>Play</button>" +
            "<button class='remove' id = 'rm-" + videoID + "'>Remove</button>" +
        "</div>";

    $('#queue-play').append(output);

    // call when click play button
    $("#" + videoID).click(function () {
        var index = $(this).parent().index();

        play(videoID);
        deleteVideoForLocalStorage(videoID, index);
        deteleVideoForQueue(videoID);
    })

    // call when click remove button
        $("#rm-" + videoID).click(function () {
            var index = $(this).parent().index();

            deleteVideoForLocalStorage(videoID, index);
            deteleVideoForQueue(videoID);
        })

        addVideoToLocalStorage(videoID);


}

function addVideoToLocalStorage(videoID) {
    var value = localStorage.getItem("LOCAL");
    var queue = JSON.parse(value);

    queue.push(videoID);
    localStorage.setItem("LOCAL", JSON.stringify(queue));
}

// play video width video id
function play(videoID) {
    // console.log(videoID);
    console.log("hello");

    if(player != null){
        player.loadVideoById({'videoId': videoID,
           'startSeconds': 0,
           'suggestedQuality': 'large'});

    }else{
        window.player = new YT.Player('video', {
          height: '390',
          width: '640',
          videoId: videoID,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}
function onPlayerStateChange(event) {
    // console.log(event.data);

    if (event.data == YT.PlayerState.ENDED) {
        nextVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}
function nextVideo() {
    // load list id video from local storage and convert json to array
    var value = localStorage.getItem("LOCAL");
    var queue = JSON.parse(value);

    // if queue is empty rerutn;
    if (queue.length == 0) {
        console.log("queue is empty");
        return;
    }
    if (queue.length == 1) {
        $("#title-queue").html("");
    }

    // get id video at first queue and remove it from queue
    var videoID = queue.shift();

    // save queue back to local storage
    localStorage.setItem("LOCAL", JSON.stringify(queue));

    play(videoID);

    deteleVideoForQueue(videoID);
}
// remove videoID from queue at index
function deleteVideoForLocalStorage(videoID, index) {
    var value = localStorage.getItem("LOCAL");
    var queue = JSON.parse(value);

    queue.splice(index, 1);
    localStorage.setItem("LOCAL", JSON.stringify(queue));

    if (queue.length == 0) {
        $("#title-queue").html("");
    }
}

