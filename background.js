chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.from == "content") {
      	//chrome.runtime.sendMessage({from: "background"});
       	console.log(request.data[0]);
	}
  }
);