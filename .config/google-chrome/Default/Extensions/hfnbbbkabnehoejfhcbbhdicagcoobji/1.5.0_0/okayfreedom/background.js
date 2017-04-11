// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

var OKF = OKF || { };

OKF.init = function()
{
	this.productinfo = OKF.prefs.getObject('productinfo', { actualCurrentLocation :  '', hashid : "", clientversion : "", language : "", wkz: "unknown" } );
	this.stats = OKF.prefs.getObject('stats', 
			{ 
				numPages : 0, 					// Anzahl aller Seiten die durch das Plugin gehen
				numPagesClientConnected : 0, 	// Seiten bei aktiver Verbindung zum OKF-Client  
				numPagesAutoOn : 0, 			// Seiten bei aktiver Verbindung zum OKF-Client und aktiver Automatik
				numBlockedContentPages : 0, 	// Seiten bei aktiver Verbindung zum OKF-Client bei denen ein geblockter Inhalt festgestellt wurde
				numUnblockedPages: 0 			// entsperrte Seiten
			} 
		);

	OKF.websocket.open();

	//console.log("remoteConfig on startup:", this.remoteConfig);
	this.remoteConfig.init(function () { return OKF.getRemoteConfigUrl(); }, function (text) { OKF.resetStats(); }, { "activeInjections" : [ ] });
	OKF.remoteConfig.checkUpdate();
	setInterval(function() { OKF.remoteConfig.checkUpdate(); }, 6 * 60 * 60 * 1000); // 6 Stunden Intervall
}

OKF.getRemoteConfigUrl = function()
{
	return 'https://www.okayfreedom.com/scripts/products/okayfreedom/plugininfo/?'
	+ 'wkz=' + this.productinfo.wkz
	+ '&hashid=' + this.productinfo.hashid
	+ '&clientversion=' + this.productinfo.clientversion
	+ '&pluginversion=' + chrome.app.getDetails().version
	+ '&language=' + this.productinfo.language
	+ '&useragent=' + encodeURIComponent(navigator.userAgent)
	+ '&stats_numPages=' + this.stats.numPages
	+ '&stats_numPagesClientConnected=' + this.stats.numPagesClientConnected
	+ '&stats_numPagesAutoOn=' + this.stats.numPagesAutoOn
	+ '&stats_numBlockedContentPages=' + this.stats.numBlockedContentPages
	+ '&stats_numUnblockedPages=' + this.stats.numUnblockedPages
	;
}

OKF.resetStats = function()
{
	this.stats = { numPages : 0, numPagesClientConnected : 0, numPagesAutoOn : 0, numBlockedContentPages : 0, numUnblockedPages: 0 };
	OKF.prefs.setObject('stats', this.stats);
}

// var activeInitiators = [];
var currentInitiator = '';
var currentInitiatorTab = 0;
var auto_on = 0;
var activeTabs = [];
var currentTab = 0;
var initiatortab = 0;
var lastUnloadURL = '';
var lastURL = '';
var tmTotal = 0;
var tmUnblock = 0;

// open WebSocket
//opensocket();


//browser.pageAction.hide();

function reloadTab()
{
	//console.log('*** reloadTab ' + taburl);
	chrome.tabs.getSelected(null, function(tab) { console.log('*** reloadTab ' + tab.url); chrome.tabs.update(tab.id, {url: tab.url}); });
	
	//console.log('*** Done reloadTab ' + taburl);
};

function timeout_disconnect()
{
	if (currentInitiator.length != 0 && currentInitiatorTab != 0)
	{
		//console.log('*** disconnect on timeout');
		OKF.websocket.send('DISCONN|' + currentInitiator + '|0|US');
		chrome.tabs.sendMessage(currentInitiatorTab, {msg: 'ACKDISC|' + currentInitiator + '|1|DE'}, function(response) { /*console.log(response);*/ });
		currentInitiator = '';
		currentInitiatorTab = 0;
		lastURL = '';
	}
};

// message handler
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	console.log('message received in background.js: "' + request.msg + '"');
	var parts = request.msg.split("#", 2);
	if (parts.length == 2 && parts[0] == "sendmessage")
	{
		initiatortab = sender.tab;
		OKF.websocket.send(parts[1]);
		sendResponse({});
	}
	else if (parts.length >= 2 && parts[0] == "reload")
	{
		chrome.tabs.update(sender.tab.id, {url: sender.tab.url/* + "&video=unblocked"*/});
		console.log('*** Reloading ' + sender.tab.url);
		sendResponse({});
	}
	/*else if (parts.length == 2 && parts[0] == "reload")
	{
		console.log("Reloading " + sender.tab.url);
		chrome.tabs.update(sender.tab, {url: sender.tab.url + "&video=unblocked"});
	}*/
	else if (parts.length >= 2 && parts[0] == "onbeforeunload")
	{
		if (currentTab.id == sender.tab.id)
		{
			if (lastUnloadURL == sender.tab.url)
			{
				//console.log('*** identical!');
				sendResponse({});
				return;
			}
		}
		if (sender.tab.url.search(/\.google\./) != -1)
		//if (parseUri(sender.tab.url).host == 'google.com')
		{
			sendResponse({});
			return;
		}
		currentTab = sender.tab;
		// see if we need to disconnect
		if (typeof activeTabs[currentInitiatorTab] != "undefined")
		{
			var curHost = '';
			if (sender.tab.id == currentInitiatorTab)
			{
				curHost = OKF.parseUri(sender.tab.url).host;
			/*}
			else
			{
				curHost = parseUri(activeTabs[currentInitiatorTab].url).host;
				//return;
			}*/
				//if (parts[1] != currentTab.url)
				var hostpart = parts[1];
				if (hostpart == "http" || hostpart == "https")
				{
					hostpart = parts[2];
				}
				if (OKF.parseUri(hostpart).host != curHost)
				{
					if (curHost == currentInitiator || curHost == 'www.' + currentInitiator)
					{
						//console.log('*** onbeforeunload from tab ' + currentTab.id + ', NOT sending DISCONN; url: ' + currentTab.url);
					}
					else
					{
						//console.log('*** onbeforeunload from tab ' + currentTab.id + ', sending DISCONN; url: ' + currentTab.url);
						OKF.websocket.send('DISCONN|' + currentInitiator + '|0|US');
						chrome.tabs.sendMessage(currentTab.id, {msg: 'ACKDISC|' + currentInitiator + '|1|DE'}, function(response) { /*console.log(response);*/ });
						currentInitiator = '';
						currentInitiatorTab = 0;
						initiatortab = 0;
						//setTimeout('reloadTab(' + sender.tab.url + ');', 1 * 1000);
						setTimeout(reloadTab, 1 * 1000);
						lastURL = '';
					}
				}
			}
		}
		//console.log('*** onbeforeunload from tab ' + currentTab.id + ', url: ' + currentTab.url);
		
		sendResponse({});
	}
	else if (parts.length == 2 && parts[0] == "onloadinject")
	{
		
		//if (OKF.websocket.isConnected()) // only ad injections when client is running
		//{			
			var curUri = OKF.parseUri(sender.tab.url);		
			var curFrameUri = OKF.parseUri(parts[1]);

			console.log('curFrame: ' + curFrameUri.host + curFrameUri.path + ' curTab: ' + curUri.host + '::'+ curUri.path);

			if (curFrameUri.host + curFrameUri.path == curUri.host + curUri.path || curUri.host == 'newtab')
			{
//				console.log('+++ sendind DOINJECT +++');
				var plugininfo = { 'NAME_SHORT' : chrome.app.getDetails().name, 'NAME' : chrome.app.getDetails().name, 
					'WEBSITE' : chrome.app.getDetails().homepage_url, 
					'WEBSITE_AD_INFO' : "https://www.okayfreedom.com/support/#free", 
					'WEBSITE_PRICECHECK_INFO' : "https://www.okayfreedom.com/support/#pricecheck", 
					'VERSION' : chrome.app.getDetails().version,
					'EXTENSION_ID' : chrome.runtime.id };				
				//console.log('plugininfo:', plugininfo);
				var info = { productinfo: OKF.productinfo, activeInjections: OKF.remoteConfig.getData().activeInjections, plugininfo: plugininfo };
				console.log('info ', OKF.remoteConfig.getData());
	//			chrome.tabs.sendMessage(sender.tab.id, {msg: 'DOINJECT|' + sender.tab.url + '|' + auto_on + '|DE|'+ encodeURIComponent(JSON.stringify(info)) }, function(response) { /*console.log(response);*/ });
console.log(sender.tab.url);
				chrome.tabs.sendMessage(sender.tab.id, {msg: 'DOINJECT', senderTabUrl: sender.tab.url, info: info }, function(response) { console.log('DOINJECT_RESPONSE:', response); });
				//console.log('after');
			}
		//}
	}
	else if (parts.length >= 2 && parts[0] == "onload") // TODO take this out, do EVERYTHING using GETRULE
	{
		OKF.stats.numPages++;
		OKF.prefs.setValue('stats', 'obj', OKF.stats);

		if (OKF.websocket.isConnected())
		{
			OKF.stats.numPagesClientConnected++;
			OKF.prefs.setValue('stats', 'obj', OKF.stats);			
		}
		if (auto_on == 0)
		{
			console.log('*** auto is off!');
			sendResponse({});
			return;
		}

		OKF.stats.numPagesAutoOn ++;
		OKF.prefs.setValue('stats', 'obj', OKF.stats);

		if (currentTab.id == sender.tab.id)
		{
			if (lastURL == sender.tab.url)
			{
				console.log('*** identical! (' + sender.tab.url + ')');
				sendResponse({});
				return;
			}
		}
		else
		{
			if (sender.tab.url.search(/\.google\./) != -1)
			{
				//console.log('### google clutter, ignoring.');
				sendResponse({});
				return;
			}
		}

		var curHost = OKF.parseUri(sender.tab.url).host;
		if (curHost == currentInitiator || curHost == 'www.' + currentInitiator)
		{
			if (currentInitiatorTab == sender.tab.id)
			{
				console.log('+++ onload same, no connect!');
				sendResponse({});
				return;
			}
		}
		tmTotal++;
		
		//~ console.log('*** onload (id: ' + sender.tab.id + '), url: ' + sender.tab.url + ' (lastURL: ' + lastURL + ') ***');
		if (!OKF.websocket.isConnected())
		{
			console.log('+++ onload not connected to client');
			sendResponse({});
			return;			
		}


		lastURL = sender.tab.url;
		currentTab = sender.tab;
		activeTabs[currentTab.id] = currentTab;
		console.log('send DOCHECK');
		chrome.tabs.sendMessage(sender.tab.id, {msg: 'DOCHECK|' + sender.tab.url + '|' + auto_on + '|DE', bDeferred : false}, function(response) { 
				if (response != undefined && response.blockedContentFound)
				{
					OKF.stats.numBlockedContentPages++;
					OKF.prefs.setValue('stats', 'obj', OKF.stats);
				}
				else
				{
					setTimeout( 
						function() { 
							chrome.tabs.sendMessage(sender.tab.id, {msg: 'DOCHECK|' + sender.tab.url + '|' + auto_on + '|DE', bDeferred : true}, 
								function(response) { 
									if (response.blockedContentFound)
									{
										OKF.stats.numBlockedContentPages++;
										OKF.prefs.setValue('stats', 'obj', OKF.stats);
									}
								});
						}
						, 1000);

				}
			});

		sendResponse({});
	}
	else
	{
		sendResponse({});
	}
	return true;
});

// the following checks creating of tabs
/*chrome.tabs.onCreated.addListener(function(tab) {
	if (typeof tab !== "undefined")
	{
		console.log('created tab id: ' + tab.id);
		console.log('created tab url: ' + tab.url + ', currentInitiator: ' + currentInitiator);
	}
});

// the following checks updating of tabs
chrome.tabs.onUpdated.addListener(function(tab) {
	if (typeof tab !== "undefined")
	{
		console.log('updated tab id: ' + tab.id);
		console.log('updated tab url: ' + tab.url + ', currentInitiator: ' + currentInitiator);
	}
});*/

chrome.tabs.onRemoved.addListener(function(tabId) {
	//console.log('removed tab id: ' + tabId);
	var tab = activeTabs[tabId];
	if (typeof tab !== "undefined")
	{
		console.log('removed tab url: ' + tab.url + ', currentInitiator: ' + currentInitiator);
		if (currentInitiator.length != 0 && tab.url.search(currentInitiator) != -1)
		{
			OKF.websocket.send('DISCONN|' + currentInitiator + '|0|DE');
			console.log('Sending DISCONN');
			chrome.tabs.sendMessage(tab.id, {msg: 'ACKDISC|' + currentInitiator + '|1|DE'}, function(response) { /*console.log(response);*/ });
			currentInitiator = '';
			currentInitiatorTab = 0;
			lastURL = '';
		}
	}
	else
	{
		//console.log('### tab undefined!');
	}
});

OKF.websocket = (function() {
	var connected = false;
	var ws;
	var port = "36405";
	var url = "ws://127.0.0.1:" + port + "/okayfreedomwebsocket";
	
	var open = function()
	{
		console.log('websocket.open');
		ws = new WebSocket(url);
		var that = this;
		ws.onopen = function(event) { onOpen(event); }
		ws.onmessage = onMessage;
		ws.onclose = function(event) { onClose(event); }
		ws.onerror = function(event) { onError(event); }
	}

	var send = function(content) 
	{
		console.log('websocket.send ', content);
		ws.send(content);
	}

	function sendCommand(cmd, site, par1, par2)
	{
		var cmd = cmd + '|' + site + '|' + par1 + '|' + par2;
		send(cmd);
	}

	var onOpen = function(evt) 
	{
		console.log("websocket.Connection opened.");
		connected = true;
		send('AUTOACT|check|0|DE');
	}

	var onClose = function(evt) 
	{
		console.log("websocket.Connection closed.");
		connected = false;
		setTimeout(function() { console.log('reconnect'); open(); }, 20 * 1000);
	}

	var onError = function (evt) 
	{
		connected = false;
		console.log("websocket.Error occured!");
	}

	 var onMessage = function(evt) 
	 {
		if (typeof evt !== "undefined" && typeof evt.data == "string") {
			console.log("websocket.onMessage ", evt.data);
			var str = evt.data.toString();
			if (str.search(/HASRULE.+/) != -1)
			{
				chrome.tabs.query({'active': true}, function(tab)
					{
						chrome.tabs.sendMessage(tab.id, {msg: str}, function(response){ });
					});
			}
			else if (str.search(/AUTO_ON.+/) != -1)
			{
				auto_on = 1;
				chrome.tabs.query({'active': true}, function (tabs)
					{
						//~ console.log(tabs[0].url);
						for (var i = 0; i < tabs.length; i++)
						{
							//console.log('* Sending message ' + str + ' to tab id ' + tabs[i].id + ' with url ' + tabs[i].url);
							chrome.tabs.sendMessage(tabs[i].id, {msg: str}, function(response) { });
						}
					});
				return;
			}
			else if (str.search(/AUTOOFF.+/) != -1)
			{
				auto_on = 0;
				chrome.tabs.query({'active': true}, function (tabs)
					{
						for (var i = 0; i < tabs.length; i++)
						{
							//~ console.log('*** id: ' + tabs[i].id + ', url: ' + tabs[i].url);
							if (tabs[i].id != null) {
								chrome.tabs.sendMessage(tabs[i].id, {msg: str}, function(response) { });
							}
						}
					});
				return;
			}
			else if (str.search(/ACKCONN.+/) != -1)
			{
				if (typeof activeTabs[initiatortab.id] != "undefined")
				{
					console.log('*** Found current initiator tab');
					chrome.tabs.get(initiatortab.id, function(tab)
						{
							chrome.tabs.sendMessage(tab.id, {msg: str}, function(response) { console.log(response); });
							console.log("Reloading " + tab.url);
							//chrome.tabs.update(tab.id, {url: tab.url/* + "&video=unblocked"*/});
							chrome.extension.sendMessage({msg: str}, function(response){});
							currentInitiatorTab = tab.id;
						});
				}
				else
				{
					console.log('*** Going with selected tab');
					chrome.tabs.query({'active': true}, function(tab)
						{
							chrome.tabs.sendMessage(tab.id, {msg: str}, function(response) { console.log(response); });
							console.log("Reloading " + tab.url);
							//chrome.tabs.update(tab.id, {url: tab.url/* + "&video=unblocked"*/});
							chrome.extension.sendMessage({msg: str}, function(response){});
							currentInitiatorTab = tab.id;
						});
				}

				// now set current connection initiator so we can disconnect later

				var msginfo = str.split("|");
				if (msginfo.length >= 4)
				{
	        		OKF.stats.numUnblockedPages++;
	        		OKF.prefs.setValue('stats', 'obj', OKF.stats);

					tmUnblock++;
					currentInitiator = msginfo[1]; // save domain of initiator
					//console.log('Saving current initiator: ' + currentInitiator);
					setTimeout(timeout_disconnect, 3 * 60 * 60 * 1000);
					
					if (tmUnblock != 0 && tmTotal != 0)
					{
						OKF.websocket.send('TMCTR|' + tmTotal + '|' + tmUnblock + '|DE');
						tmTotal = 0;
						tmUnblock = 0;
					}
				}
			}
			else if (str.search(/ACK_ERR.+/) != -1)
			{
				chrome.tabs.query({ 'acitve': true }, function(tab)
					{
						chrome.tabs.sendMessage(tab.id, {msg: str}, function(response) { console.log(response); });
						console.log("Error unlocking " + tab.url);
						chrome.extension.sendMessage({msg: str}, function(response) { });
					});
				// reset current connection initiator
				currentInitiator = '';
				currentInitiatorTab = 0;
			}
			else if (str.search(/INFO.+/) != -1)
			{
				var msginfo = str.split("|");
				var oldWkz = OKF.productinfo.wkz;
				if (msginfo.length >= 3) // OKF.version <= 1.3.3.0
				{
					if (msginfo[2] == 'DE')
						OKF.productinfo.wkz = 'DEBUG_' + encodeURIComponent(str);//msginfo[2]
					else
						OKF.productinfo.wkz = msginfo[2];
					OKF.productinfo.actualCurrentLocation = msginfo[3];					
				}
				else if (msginfo.length == 2)
				{
					OKF.productinfo = JSON.parse(msginfo[1]);
				}
				OKF.prefs.setObject('productinfo', OKF.productinfo);
				if (oldWkz != OKF.productinfo.wkz)
				{
					OKF.remoteConfig.recheckUpdate();	// update injection infos with new wkz
				}
			}
			else
			{
				chrome.extension.sendMessage({msg: "onreply#" + str}, function(response){});
			}
		}
	}

	var isConnected = function()
	{
		return connected;
	}

    return {
        open: open, send: send, sendCommand: sendCommand, isConnected: isConnected
    };
})();

OKF.init();
