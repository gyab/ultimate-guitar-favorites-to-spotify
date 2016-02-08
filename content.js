$(document).ready(function() {

    var x = document.getElementsByClassName("bl");

    var iDiv = document.createElement('div');
    iDiv.innerHTML = "<button id='checkPage'>Export to Spotify</button><button class='btn btn-primary' id='btn-login'>Login</button><div id='result'></div><script id='result-template' type='text/x-handlebars-template'><dl><img src='{{images.0.url}}'><dt>User Name</dt><dd>{{id}}</dd><dt>Display Name</dt><dd>{{display_name}}</dd><dt>Country</dt><dd>{{country}}</dd><dt>Followers</dt><dd>{{followers.total}}</dd><dt>Profile</dt><dd><a href='{{external_urls.spotify}}' target='_blank'>{{external_urls.spotify}}</a></dd><dt>Email</dt><dd>{{email}}</dd><dt>Product</dt><dd>{{product}}</dd></dl></script>";
    iDiv.id = 'block';
    iDiv.className = 'block';
    document.body.insertBefore(iDiv, document.body.firstChild);

    document.getElementById('checkPage').addEventListener("click", function() {
        chrome.runtime.sendMessage({
            from: "content",
            data: getData()
        });
    });

    var templateSource = document.getElementById('result-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('result'),
        loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    var track_id;
                    getTrack(accessToken, track_id)
                        .then(function(response) {
                            console.log(track_id);
                            addToPlaylist(accessToken, "ahem", "0UBBuHt9ZNiqEgAxzbIh0I", track_id); 
                        });
                    //loginButton.style.display = 'none';
                    //createPlaylist(accessToken, response.id);
                });
        });
    });

    function getTrack(accessToken, track_id) {
        $.ajax({
            type: "GET",
            url: "https://api.spotify.com/v1/search",
            data: 
                {
                    "q": "Arctic Monkeys Riot Van",
                    "type": "track"
                }
            ,
            dataType: "json",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            success: function(data){
                track_id = data.tracks.items[0].artists[0].id;
                console.log(track_id);
            }
        });     
    }

    function addToPlaylist(accessToken, user_id, playlist_id, track_id) {
        return $.ajax({
            type: "POST",
            url: "https://api.spotify.com/v1/users/"+ user_id +"/playlists/"+ playlist_id +"/tracks",
            data: {
                "uris": "spotify:track:" + track_id,
            },
            dataType: "json",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            success: function(data){
                console.log(data);
            }
        });
    }

    function createPlaylist(accessToken, id) {
        return $.ajax({
            type: "POST",
            url: "https://api.spotify.com/v1/users/" + id + "/playlists",
            data: JSON.stringify({
                "name": "A New Playlist",
                "public": "false"
            }),
            dataType: "json",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + accessToken,
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
                .replace(" Tab", "")
                .replace(/\s\(ver \d+\)/, "")
            ]);
        });

        return songs;
    }

});