
var filter = [];
 
function onRequest(request, sender, sendResponse) {

  sendResponse(filter);
  
};

function lataafiltteri() {

		//alert("lataafilter!");

		chrome.storage.local.get({filter_asetukset: "http://olli.wtf/hintahaku/filter.txt"}, function(items) {

			//var osoite = "http://olli.wtf/hintahaku-kehitys/filter2.txt";
			
			var osoite = items.filter_asetukset;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", osoite, true);
			xhr.onload = function (e) {
				if (xhr.readyState === 4) {
						if (xhr.status === 200) {

							var temp = xhr.responseText;
							temp = temp.split("\n");

							for(var i=0; i<temp.length; i++) {

								filter[i] = temp[i].split("<!>");

							}

						}
				}
			};
			xhr.onerror = function (e) {
				alert("Hintahaku: Virhe haettaessa filtteriä: " + xhr.statusText);
			};
			xhr.send(null);
		
		});

};


chrome.extension.onRequest.addListener(onRequest);
chrome.runtime.onStartup.addListener(lataafiltteri);
chrome.runtime.onInstalled.addListener(lataafiltteri);
