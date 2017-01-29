const $ = require('jquery');

const CLIENT_ID = "e78c4b5a89334dea898452bfe6b1c1e5";
const REDIRECT_URI = 'http://antoinemary.com/ug-to-spotify';
const scopes = ['playlist-read-private','playlist-modify-private'];

let windowEventAttached = false;
let userInfos = {};
let songsArr = []

export function init() {
    login(function(accessToken) {
        getUserData(accessToken);
    });
};

/**
 * Log to Spotify account to get specific rights 
 * @param  {function} callback
 * @return {string} accessToken - Spotify API token
 */
function login(callback) {
    let url = getLoginURL(CLIENT_ID, REDIRECT_URI, scopes);

    let width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

    if(!windowEventAttached) {
        window.addEventListener("message", function(event) {
            let hash = JSON.parse(event.data);
            if (hash.type === 'access_token') {
                callback(hash.access_token);
            }
        });

        windowEventAttached = true;
    }

    let w = window.open(url,
        'Spotify',
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );

}

 /**
 * Get user's favorites songs from http://my.ultimate-guitar.com/main.php?mode=favorites
 * @return {array} songs - artist and name of the song
 */
function getData(pSongsArr) {

    return new Promise(function(resolve, reject) {
    
        //get html element based on regex (code from http://james.padolsey.com/snippets/regex-selector-for-jquery/)
        $.expr[':'].regex = function(elem, index, match) {
            let matchParams = match[3].split(','),
                validLabels = /^(data|css):/,
                attr = {
                    method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                    property: matchParams.shift().replace(validLabels, '')
                },
                regexFlags = 'ig',
                regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g, ''), regexFlags);
            return regex.test($(elem)[attr.method](attr.property));
        }

        //simulate click to get all the songs
        $("#pager_left").find("a")[1].click();

        //For each td, get the artist and song data
        $('tr:regex(tabindex,-1)').each(function() {
            let artist = $(this).find('td:nth-child(3)').text() ? $(this).find('td:nth-child(3)').text() : pSongsArr[pSongsArr.length - 1][0]
            pSongsArr.push([
                artist,
                $(this).find('td:nth-child(4)').text()
                .replace(" Acoustic", '')
                .replace(" Chords", '')
                .replace(" Tab", '')
                .replace(" Ukulele", '')
                .replace(/\s\(ver \d+\)/, "")
            ]);
        });

        resolve();

    })

}

/**
 * [getLoginURL description]
 * @param  {[type]} pClientID    [description]
 * @param  {[type]} pRedirectURI [description]
 * @param  {[type]} pScopes      [description]
 * @return {[type]}              [description]
 */
function getLoginURL(pClientID, pRedirectURI, pScopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + pClientID +
        '&redirect_uri=' + encodeURIComponent(pRedirectURI) +
        '&scope=' + encodeURIComponent(pScopes.join(' ')) +
        '&response_type=token';
}

 /**
 * Create the Spotify playlist
 * @param {string} pAccessToken - Spotify API token
 * @param {string} pID - Spotify user ID
 */
function createPlaylist(pAccessToken, pID) {
    let playlistName = window.prompt("Playlist name", "Name of your playlist");
    if (playlistName) {
        document.getElementById('block').innerHTML = "<style>.loader{position:relative;height:100%;width:100%; text-align:center;vertical-align:middle;line-height:50px; margin:100px auto;font-size:12px;width:1em;height:1em;border-radius:50%;text-indent:-9999em;-webkit-animation:load5 1.1s infinite ease;animation:load5 1.1s infinite ease;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0)}@-webkit-keyframes load5{0%,100%{box-shadow:0 -2.6em 0 0 #fff,1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.5),-1.8em -1.8em 0 0 rgba(255,255,255,.7)}12.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.7),1.8em -1.8em 0 0 #fff,2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.5)}25%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.5),1.8em -1.8em 0 0 rgba(255,255,255,.7),2.5em 0 0 0 #fff,1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}37.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.5),2.5em 0 0 0 rgba(255,255,255,.7),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}50%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.5),1.75em 1.75em 0 0 rgba(255,255,255,.7),0 2.5em 0 0 #fff,-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}62.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.5),0 2.5em 0 0 rgba(255,255,255,.7),-1.8em 1.8em 0 0 #fff,-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}75%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.5),-1.8em 1.8em 0 0 rgba(255,255,255,.7),-2.6em 0 0 0 #fff,-1.8em -1.8em 0 0 rgba(255,255,255,.2)}87.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.5),-2.6em 0 0 0 rgba(255,255,255,.7),-1.8em -1.8em 0 0 #fff}}@keyframes load5{0%,100%{box-shadow:0 -2.6em 0 0 #fff,1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.5),-1.8em -1.8em 0 0 rgba(255,255,255,.7)}12.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.7),1.8em -1.8em 0 0 #fff,2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.5)}25%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.5),1.8em -1.8em 0 0 rgba(255,255,255,.7),2.5em 0 0 0 #fff,1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}37.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.5),2.5em 0 0 0 rgba(255,255,255,.7),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}50%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.5),1.75em 1.75em 0 0 rgba(255,255,255,.7),0 2.5em 0 0 #fff,-1.8em 1.8em 0 0 rgba(255,255,255,.2),-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}62.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.5),0 2.5em 0 0 rgba(255,255,255,.7),-1.8em 1.8em 0 0 #fff,-2.6em 0 0 0 rgba(255,255,255,.2),-1.8em -1.8em 0 0 rgba(255,255,255,.2)}75%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.5),-1.8em 1.8em 0 0 rgba(255,255,255,.7),-2.6em 0 0 0 #fff,-1.8em -1.8em 0 0 rgba(255,255,255,.2)}87.5%{box-shadow:0 -2.6em 0 0 rgba(255,255,255,.2),1.8em -1.8em 0 0 rgba(255,255,255,.2),2.5em 0 0 0 rgba(255,255,255,.2),1.75em 1.75em 0 0 rgba(255,255,255,.2),0 2.5em 0 0 rgba(255,255,255,.2),-1.8em 1.8em 0 0 rgba(255,255,255,.5),-2.6em 0 0 0 rgba(255,255,255,.7),-1.8em -1.8em 0 0 #fff}}</style><div class='loader'>Loading...</div>";
        fetch("https://api.spotify.com/v1/users/" + pID + "/playlists",
        {
            method: "POST",
            body: JSON.stringify({
                "name": playlistName,
                "public": false
            }),
            headers: {
                "Authorization": "Bearer " + pAccessToken,
            }
        })
        .then(function(response) {
            return response.json(function(resolve, reject) {
                resolve('success');
            });
        })
        .then((json) => {
            getTrack(pAccessToken, json['id'], songsArr);
        })
    }
}

/**
 * Get Spotify id of each track
 * @param  {string} accessToken - Spotify API token
 * @param  {string} playlistID - ID of the new Spotify playlist
 */
function getTrack(pAccessToken, pPlaylistID, pSongsArr) {
    let arrID = { uris: [] },
        results = [],
        songsTasks = [];

    songsTasks = pSongsArr.map(function(song) {
        return function() {
            return new Promise(function(resolve, reject) {
                let returnValue;
                fetch('https://api.spotify.com/v1/search?q=' + song[0] + ' ' + song[1] +'&type=track', 
                {
                    headers: {
                        'Authorization': 'Bearer ' + pAccessToken,
                    }
                })
                .then(function(response) {
                    return response.json(function(resolve, reject) {
                        resolve('success');
                    });
                })
                .then(function(json) {
                    if(json.tracks !== undefined && json.tracks.items[0] !== undefined)
                        arrID.uris.push(json.tracks.items[0].uri);
                    return resolve('success');
                });
            })
        }
    })

    let s = songsTasks[0]();
    
    for(var i = 1; i < songsTasks.length; i++) {
        s = s.then(songsTasks[i]);
    }

    s.then(function() {
        let nbAdd = Math.floor(arrID.uris.length / 100) + 1;
        
        for(let i = 0; i < nbAdd; i++) {
            let arrToAdd = JSON.stringify(arrID.uris.splice(0,99));
            addToPlaylist(pAccessToken, userInfos.id, pPlaylistID, arrToAdd);
        }
    });

}

/**
 * Add songs to the new Spotify playlist
 * @param  {string} accessToken - Spotify API token
 * @param {string} userID - Spotify ID
 * @param  {string} playlistID - ID of the new Spotify playlist
 * @param {json} idTracks - Spotify URI for each song
 */
function addToPlaylist(accessToken, userID, playlistID, idTracks) {
    fetch("https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks/",
    {
        method: "POST",
        body: idTracks,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
    })
    .then(() => {
        document.getElementById('block').innerHTML = "<style>#block{position:relative;height:100%;width:100%; background:url(https://antoinemary.com/media/thumb_up-128.png) no-repeat;background-size:auto 100%}</style>";
        $("#block").fadeOut(3000);
    });
}


/**
* Get Current User’s Profile
* @param  {string} accessToken - Spotify API token
*/
function getUserData(accessToken, callback) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        }
    })
    .then(function(response) {
        return response.json(function(resolve, reject) {
            resolve('success');
        });
    })
    .then(function(json) {
        userInfos = json;
    })
    .then(getData(songsArr))
    .then(function() {
        createPlaylist(accessToken, userInfos.id);
    })
    .catch(function(err) {
       console.log(err); 
    });
}

