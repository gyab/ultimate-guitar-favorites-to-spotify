const spotify = require('./spotify');

(function(doc){

	var $divSpotify = doc.createElement('div');
    $divSpotify.setAttribute("style", "position:absolute;height:100px;width:100px;top:45%;left:10%; border:0; margin-left:-50px;");
    $divSpotify.innerHTML = "<button id='btn-login' href=''></button>";
    $divSpotify.id = 'block';
	$divSpotify.className = 'block';
	doc.body.insertBefore($divSpotify, doc.body.firstChild);

    var $btnSpotify = doc.getElementById('btn-login');
	$btnSpotify.setAttribute("style", "background:url(https://antoinemary.com/media/icon128.png) no-repeat;background-size:auto 100%; width:100%;height:100%;top:85px;border:0");

	$btnSpotify.addEventListener('click', spotify.init);

})(document);

