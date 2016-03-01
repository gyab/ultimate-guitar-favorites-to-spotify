$(document).ready(function() {

    var iDiv = document.createElement('div');
    iDiv.setAttribute("style", "position:absolute;height:100px;width:100px;top:45%;left:50%; border:0; margin-left:-50px; #btn-login{background:url(http://s24.postimg.org/a767sr8c1/icon128.png) no-repeat;background-size:auto 100%; width:100%;height:100%;top:85px;border:0}");
    iDiv.innerHTML = "<button id='btn-login' href=''></button>";
    iDiv.id = 'block';
    iDiv.className = 'block';
    document.body.insertBefore(iDiv, document.body.firstChild);
    document.getElementById('btn-login').setAttribute("style", "background:url(http://s24.postimg.org/a767sr8c1/icon128.png) no-repeat;background-size:auto 100%; width:100%;height:100%;top:85px;border:0");

    var loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    songs = getData();
                    createPlaylist(accessToken, response.id);
                });
        });
    });



    var idUser = null;

    function createPlaylist(accessToken, id) {
        var playlistName = window.prompt("Playlist name","Type the name you want for the playlist");
        if(playlistName) {
            document.getElementById('block').innerHTML = "<style>.loader{position:relative;height:100%;width:100%; text-align:center;vertical-align:middle;line-height:50px; margin:100px auto;font-size:12px;width:1em;height:1em;border-radius:50%;text-indent:-9999em;-webkit-animation:load5 1.1s infinite ease;animation:load5 1.1s infinite ease;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0)}@-webkit-keyframes load5{0%,100%{box-shadow:0 -2.6em 0 0 #fff,1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.5),-1.8em -1.8em 0 0 rgba(255,255,255,.7)}12.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.7),1.8em -1.8em 0 0 #fff,2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.5)}25%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.5),1.8em -1.8em 0 0 rgba(255,255,255,.7),2.5em 0 0 0 #fff,1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}37.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.5),2.5em 0 0 0 rgba(255,255,255,.7),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}50%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.5),1.75em 1.75em 0 0 rgba(255,255,255,.7),0 2.5em 0 0 #fff,-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}62.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.5),0 2.5em 0 0 rgba(255,255,255,.7),-1.8em 1.8em 0 0 #fff,-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}75%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.5),-1.8em 1.8em 0 0 rgba(255,255,255,.7),-2.6em 0 0 0 #fff,-1.8em -1.8em 0 0 rgba(255,255,255,.2)}87.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.5),-2.6em 0 0 0 rgba(255,255,255,.7),-1.8em -1.8em 0 0 #fff}}@keyframes load5{0%,100%{box-shadow:0 -2.6em 0 0 #fff,1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.5),-1.8em -1.8em 0 0 rgba(255,255,255,.7)}12.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.7),1.8em -1.8em 0 0 #fff,2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.5)}25%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.5),1.8em -1.8em 0 0 rgba(255,255,255,.7),2.5em 0 0 0 #fff,1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}37.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.5),2.5em 0 0 0 rgba(255,255,255,.7),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}50%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.5),1.75em 1.75em 0 0 rgba(255,255,255,.7),0 2.5em 0 0 #fff,-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}62.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.5),0 2.5em 0 0 rgba(255,255,255,.7),-1.8em 1.8em 0 0 #fff,-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}75%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.5),-1.8em 1.8em 0 0 rgba(255,255,255,.7),-2.6em 0 0 0 #fff,-1.8em -1.8em 0 0 rgba(255,255,255,.2)}87.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.5),-2.6em 0 0 0 rgba(255,255,255,.7),-1.8em -1.8em 0 0 #fff}}</style><div class='loader'>Loading...</div>";
            return $.ajax({
                type: "POST",
                url: "https://api.spotify.com/v1/users/" + id + "/playlists",
                data: JSON.stringify({
                    "name": playlistName,
                    "public": "false"
                }),
                dataType: "json",
                contentType: "application/json",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
                success: function(data) {
                    getTrack(accessToken, data['id']);
                }
            });
        }
    }

    function getTrack(accessToken, playlistID, callback) {
        var arrID = new Object();
        var indexSuc = 0;
        arrID.uris = [];
        var results = [];

        songs.forEach(function(song){
            results.push($.ajax({
                type: "GET",
                url: "https://api.spotify.com/v1/search",
                data: 
                    {
                        "q": song[0] + " " + song[1],
                        "type": "track"
                    }
                ,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
                success: function(data){
                    try {
                        arrID.uris.push("spotify:track:"+data.tracks.items[0].id)                    
                    }
                    catch (e){
                        console.log(e);
                    }
                }
            }));
            console.log(song[0]);
        })

        $.when.apply(this, results).done(function() {
            addToPlaylist(accessToken, idUser, playlistID, JSON.stringify(arrID.uris)); 
        });
    }

    function addToPlaylist(accessToken, user_id, playlist_id, idTracks) {
        $.ajax({
            type: "POST",
            url: "https://api.spotify.com/v1/users/" + user_id + "/playlists/" + playlist_id + "/tracks/",
            data: idTracks,
            dataType: "json",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function(data){
                document.getElementById('block').innerHTML = "<style>#block{position:relative;height:100%;width:100%; background:url(http://s24.postimg.org/4xawcbjsl/thumb_up_512.png) no-repeat;background-size:auto 100%}</style>";
                $("#block").fadeOut(3000);
            }
        });
    }

    function login(callback) {
        var CLIENT_ID = "e78c4b5a89334dea898452bfe6b1c1e5";
        var REDIRECT_URI = 'http://antoinemary.com/ug-to-spotify';
        scopes = 'playlist-read-private playlist-modify-private';

        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                '&scope=' + encodeURIComponent(scopes.join(' ')) +
                '&response_type=token';
        }

        var url = getLoginURL([
            'playlist-read-private playlist-modify-private'
        ]);

        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);

        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);

        var w = window.open(url,
            'Spotify',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
        );

    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken,

            },
            success: function (data) {
                idUser = data.id;
            }
        });
    }

    function getData() {
        //get html element based on regex (code from http://james.padolsey.com/snippets/regex-selector-for-jquery/)
        jQuery.expr[':'].regex = function(elem, index, match) {
            var matchParams = match[3].split(','),
                validLabels = /^(data|css):/,
                attr = {
                    method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                    property: matchParams.shift().replace(validLabels, '')
                },
                regexFlags = 'ig',
                regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g, ''), regexFlags);
            return regex.test(jQuery(elem)[attr.method](attr.property));
        }

        //declare array
        var songs = [];

        //simulate click to get all the songs
        $("#pager_left").find("a")[1].click();

        //For each td, get the artist and song data
        $('tr:regex(tabindex,-1)').each(function() {
            var artist = $(this).find('td:nth-child(3)').text() ? $(this).find('td:nth-child(3)').text() : songs[songs.length - 1][0]
            songs.push([
                artist,
                $(this).find('td:nth-child(4)').text()
                    .replace(" Acoustic", '')
                    .replace(" Chords", '')
                    .replace(" Tab", '')
                    .replace(" Ukulele", '')
                    .replace(/\s\(ver \d+\)/, "")
            ]);
        });

        return songs;
    }

});