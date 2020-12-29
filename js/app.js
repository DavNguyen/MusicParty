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

  

