//get html element based on regex (code from http://james.padolsey.com/snippets/regex-selector-for-jquery/)
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

//declare array
songs = [];

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
    		.replace(/\s\(ver \d+\)/, "")]);
});