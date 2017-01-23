import * as spotify from './spotify'; 

document.body.appendChild("test");

document.addEventListener("DOMContentLoaded", function(event) { 

    var iDiv = document.createElement('div');
    iDiv.setAttribute("style", "position:absolute;height:100px;width:100px;top:45%;left:10%; border:0; margin-left:-50px;");
    iDiv.innerHTML = "<button id='btn-login' href=''></button>";
    iDiv.id = 'block';
    iDiv.className = 'block';
    document.body.insertBefore(iDiv, document.body.firstChild);
    document.getElementById('btn-login').setAttribute("style", "background:url(https://antoinemary.com/media/icon128.png) no-repeat;background-size:auto 100%; width:100%;height:100%;top:85px;border:0");

    var loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        spotify.login(function(accessToken) {
            spotify.getUserData(accessToken)
                .then(function(response) {
                    songs = getData();
                    spotify.createPlaylist(accessToken, response.id);
                });
        });
    });

});