$(document).ready(function() {

    var x = document.getElementsByClassName("bl");

    var iDiv = document.createElement('div');
    iDiv.innerHTML = "<style>.block { position: absolute; height: 100px; width: 100px; top: 50%; left: 50%; margin-left: -50px; margin-top: -50px; background: url('http://s28.postimg.org/epbmv9xw9/ajax_loader.gif'); background-size: 100%; }";
    iDiv.id = 'block';
    iDiv.className = 'block';
    document.body.insertBefore(iDiv, document.body.firstChild);

    var loginButton = document.getElementById('btn-login');

    var blDiv = document.getElementsByClassName('bl');
    var iSpinner = document.createElement('div');
    iSpinner.innerHTML = "<style>.spinner { display:none; position: absolute; height: 100px; width: 100px; top: 50%; left: 50%; margin-left: -50px; margin-top: -50px; background: url('http://s28.postimg.org/epbmv9xw9/ajax_loader.gif'); background-size: 100%; }";
    iSpinner.className = "spinner";

    blDiv[1].insertBefore(iSpinner, blDiv.firstChild);

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    songs = getData();
                    createPlaylist(accessToken, response.id);
                    //loginButton.style.display = 'none';
                });
        });
    });

    var idUser = null;

    function createPlaylist(accessToken, id) {
        var playlistName = window.prompt("Playlist name","Type the name you want for the playlist");
        if(playlistName) {
            document.getElementsByClassName('spinner')[0].style.display = 'inline';
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
            document.getElementsByClassName('spinner')[0].style.display = 'none';
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