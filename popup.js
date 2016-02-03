function setDOMInfo(info) {
  document.getElementById('result').textContent  = info;
}

document.getElementById('checkPage').addEventListener("click", function () {
  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    setDOMInfo(response.data[0]);
    console.log("test from popup");
  });
});

/*$(document).ready(function() {
  $("#checkPage").click(function() {
    chrome.tabs.executeScript(null, {file:'getData.js'});
    $.ajax({
      url: 'https://api.spotify.com/v1/search?q=track:riot%20van%20artist:arctic%20monkeys&type=track',
      error: function() {
        $('#result').html('<p>An error has occurred</p>');
      },
      success: function(data) {
        console.log(data);
        $('#result').append(data);
      },
      type: 'GET'
    });
  });
});*/