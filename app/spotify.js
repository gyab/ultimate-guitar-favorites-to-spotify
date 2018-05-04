const $ = require('jquery');

const CLIENT_ID = "e78c4b5a89334dea898452bfe6b1c1e5";
const REDIRECT_URI = 'http://antoinemary.com/ug-to-spotify';
const scopes = ['playlist-read-private','playlist-modify-private'];

let windowEventAttached = false;
let userInfos = {};
let songsArr = null;
let playlistName = "";
let onSuccessUGtoSpotify = null;

/**
 * Init the application. Only exported function of the file.
 * @param  {[type]} pPlaylistName         [description]
 * @param  {[type]} pOnSuccessUGtoSpotify [description]
 * @return {[type]}                       [description]
 */
export function init(pPlaylistName, pOnSuccessUGtoSpotify) {
    songsArr = [];
    playlistName = pPlaylistName;
    onSuccessUGtoSpotify = pOnSuccessUGtoSpotify;
    login(function(accessToken) {
        getUserData(accessToken);
    });
};

/**
 * Log to Spotify account to get specific rights
 * @param  {Function} callback
 * @return {String} accessToken - Spotify API token
 */
function login(callback) {
    let url = getLoginURL(CLIENT_ID, REDIRECT_URI, scopes);

    let width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

    if(!windowEventAttached) {
        window.addEventListener("message", function(event) {
            if (typeof event.data === 'string') {
                try {
                    let hash = JSON.parse(event.data);
                    if (hash.type === 'access_token') {
                        callback(hash.access_token);
                    }
                } catch (e) {
                    // event.data is not a valid JSON
                }

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
 * @return {Array} songs - artist and name of the song
 */
function getData(pSongsArr) {

    return new Promise(function(resolve, reject) {

        //simulate click to get all the songs
        const pageButtons = document.querySelectorAll(".kRvt3");
        for(const button in pageButtons) {
            if (pageButtons[button].innerText.toLowerCase() === "all") {
                pageButtons[button].click();
                break;
            }
        }

        //For each song, get the artist and the song name
        $("._1iQi2").each(function() {
            if (!$(this).hasClass('_1Lagi')) {
                const allLinks = $(this).find('a');
                const artist = allLinks.length === 2 ? allLinks[0].innerText.trim() : pSongsArr[pSongsArr.length - 1][0];
                const song = allLinks.length === 2 ? allLinks[1].innerText : allLinks[0].innerText;
                pSongsArr.push([
                    artist,
                    song.replace(" Acoustic", '')
                        .replace(" Chords", '')
                        .replace(" Tab", '')
                        .replace(" Ukulele", '')
                        .replace(/\s*\(ver\s\d+\)\s*/, "")
                        .trim()
                ]);   
            }
        });

        resolve();

    })

}

/**
 * Get the login URL based on three parameters
 * @param  {Integer} pClientID - Client ID
 * @param  {String} pRedirectURI - Redirect URI
 * @param  {Array} pScopes - Array that contains the rights the app will ask to the Spotify API
 * @return {String} - Login URL
 */
function getLoginURL(pClientID, pRedirectURI, pScopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + pClientID +
        '&redirect_uri=' + encodeURIComponent(pRedirectURI) +
        '&scope=' + encodeURIComponent(pScopes.join(' ')) +
        '&response_type=token';
}

/**
 * Create the Spotify playlist
 * @param {String} pAccessToken - Spotify API token
 * @param {String} pID - Spotify user ID
 */
function createPlaylist(pAccessToken, pID) {
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
        .catch(function(err) {
            console.log(err);
            onSuccessUGtoSpotify(false);
        });
}

/**
 * Get Spotify id of each track
 * @param  {String} accessToken - Spotify API token
 * @param  {String} playlistID - ID of the new Spotify playlist
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
                        if(typeof json.tracks !== 'undefined' && typeof json.tracks.items[0] !== 'undefined')
                            arrID.uris.push(json.tracks.items[0].uri);
                        return resolve('success');
                    })
                    .catch(function(err) {
                        console.log(err);
                        onSuccessUGtoSpotify(false);
                    });
            })
        }
    });

    let s = songsTasks[0]();

    for(var i = 1; i < songsTasks.length; i++) {
        s = s.
        then(songsTasks[i])
            .catch(function(err) {
                console.log(err);
                onSuccessUGtoSpotify(false);
            });
    }

    s.then(function() {

        let nbAdd = Math.floor(arrID.uris.length / 100) + 1;

        for(let i = 0; i < nbAdd; i++) {
            let arrToAdd = JSON.stringify(arrID.uris.splice(0,99));
            addToPlaylist(pAccessToken, userInfos.id, pPlaylistID, arrToAdd);
        }
    })
        .then(() => onSuccessUGtoSpotify(true))
        .catch(function(err) {
            console.log(err);
            onSuccessUGtoSpotify(false);
        });

}

/**
 * Add songs to the new Spotify playlist
 * @param  {String} accessToken - Spotify API token
 * @param {String} userID - Spotify ID
 * @param  {String} playlistID - ID of the new Spotify playlist
 * @param {JSON} idTracks - Spotify URI for each song
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
            //document.getElementById('block').innerHTML = "<style>#block{position:relative;height:100%;width:100%; background:url(https://antoinemary.com/media/thumb_up-128.png) no-repeat;background-size:auto 100%}</style>";
            //$("#block").fadeOut(3000);
        })
        .catch(function(err) {
            console.log(err);
            onSuccessUGtoSpotify(false);
        });
}


/**
 * Get Current User’s Profile
 * @param  {String} accessToken - Spotify API token
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
        .then(() => getData(songsArr))
        .then(() => createPlaylist(accessToken, userInfos.id))
        .catch(function(err) {
            console.log(err);
            onSuccessUGtoSpotify(false);
        });
}

