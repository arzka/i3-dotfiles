// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

var unblock_tries = 0;
var auto_on = 0;
var current_country = 'DE';
var current_country_init = 'DE';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('message received in docload.js: "' + request.msg + '"');

	var parts = request.msg.split("|");
	if (parts.length == 4 && parts[0] == "ACKCONN")
	{
		unblock_success(request.msg);
		current_country = parts[3];
		sendResponse({});
	}
	else if (parts.length == 4 && parts[0] == "ACK_ERR")
	{
		//~ unblock_error(request.msg);
		unblock_error("error");
		current_country = parts[3];
		sendResponse({});
	}
	else if (parts.length == 4 && parts[0] == "AUTO_ON")
	{
		console.log('AUTO_ON');
		auto_on = 1;
		unblock_tries = 0;
		current_country = parts[3];
		current_country_init = parts[3];
		sendResponse({});
	}
	else if (parts.length == 4 && parts[0] == "AUTOOFF")
	{
		//~ alert("test");
		console.log('AUTOFF');
		auto_on = 0;
		unblock_tries = 0;
		current_country = parts[3];
		current_country_init = parts[3];
		if (parts[1] == "expired")
		{
			unblock_error("expired");
		}
		else if (parts[1] == "exceeded")
		{
			unblock_error("exceeded");
		}
		sendResponse({});
	}	
	else if (parts.length == 4 && parts[0] == "DOCHECK")
	{		
		auto_on = parts[2];
		var blockedContentFound = false;
		var bDeferred = request.bDeferred;
		
		if (document.location.href.search(/\.google\.+/) == -1) // not google
		{
			if (auto_on != 0)
			{
				var params = null;
				if (bDeferred)
					params = checkBlockedDeferred(document);
				else
					params = checkBlocked(document);
				if (params != null)
				{
					blockedContentFound = true;
					if (unblock_tries == 0)
					{
						//~ console.log('On tv.com, initiating US connection...');
						unblock_tries = 1;
						dispatch(compileCommand('CONNECT', params.host, params.par1, params.country));
						insertMessageBody(chrome.i18n.getMessage("unlocking"), 'loading');
					}
					else
					{
						insertMessageBody(chrome.i18n.getMessage("cantunlock"), 'error');
					}
				}

			}
		}
		sendResponse({ blockedContentFound: blockedContentFound });
	}
	else if (parts[0] == "DOINJECT")
	{		
		var curUri = OKF.parseUri(request.senderTabUrl);
		var curFrameUri = OKF.parseUri(document.location.href);
		if (curFrameUri.host + curFrameUri.path == curUri.host + curUri.path || curUri.host == 'newtab')
		{
			var info = request.info;//JSON.parse(decodeURIComponent(parts[4]));
			//console.log('inject info ', info);
			OKF.injection.inject(document, info.activeInjections, info.productinfo, info.plugininfo );

			sendResponse({});
		}
	}
	else if (parts.length == 4 && parts[0] == "ACKDISC")
	{
		current_country = current_country_init;
		sendResponse({});
	}
	else
	{
		sendResponse({});
	}
});

window.onbeforeunload = function() {
	chrome.extension.sendMessage({msg: "onbeforeunload#" + document.location.href}, function(response){});
}

function onLoadCheck() {
	console.log("onLoadCheck");
	chrome.extension.sendMessage({msg: "onload#" + document.location.href}, function(response){});
}

if (document.location.href.search(/\.google\.+/) == -1)
{
	setTimeout("onLoadCheck();", 1000);
}


function onLoadCheckInject() {
	console.log("onLoadCheckInject");
	chrome.extension.sendMessage({msg: "onloadinject#" + document.location.href}, function(response){});
}

setTimeout("onLoadCheckInject();", 2000); // wait to let page finish loading async stuff


function dispatch(content) {
	var msgcontent = "";
	msgcontent = content;
	chrome.extension.sendMessage({msg: "sendmessage#" + msgcontent}, function(response){});
}

function onreply(reply)
{
}

function compileCommand(cmd, host, par1, par2)
{
	var cmd = cmd + '|' + host + '|' + par1 + '|' + par2;
	console.log('command: ' + cmd);
	return cmd
}

function onUnload()
{
	//showAlert('Document unloaded: \n' + document.location.href);
}

var g_bInserted = 0;

function changeThenFade(message, type)
{
	setTimeout('updateInfoDivMessage("' + message +	'", "' + type + '")', 5000);
}

function insertMessageBody(messagetext, type)
{
	if (g_bInserted)
	{
		updateInfoDivMessage(messagetext, type);
		return;
	}
	// insert CSS
	OKF.addCss(document,'@import url(http://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700|Ubuntu+Condensed); body {	margin: 0;	padding: 0; } #okayfreedom h1.okayfreedom_status { padding-left: 25px; padding-right: 25px; font-size: 30px;	font-family: Ubuntu, sans-serif; font-weight: 400; color: black; padding-bottom: 5px;} #okayfreedom { background: rgba(255,254,255,0.9) url(' + chrome.extension.getURL('img/rainbow.png') + ') no-repeat center -70px;	padding-top: 32px;	padding-bottom: 5px;	z-index: 10001;  text-align: center;	width: 100%;	height: 100%;	position: fixed;}#okayfreedom #okayfreedom_logo {	width: 100%;	height: 380px;	display: block;	z-index: 10002;  background-image: url(' + chrome.extension.getURL('img/ok_logo_big_none.png') + ');	background-repeat: no-repeat;	background-position: center;	margin-right: auto;	margin-left: auto;	margin-bottom: -48px;	position: relative;} #okayfreedom #okayfreedom_logo span {	position: absolute;	left: 50%; margin-left: -76px;	top: 84px;	width: 152px;	height: 162px;	display: block;	z-index: 10003;  background-repeat: no-repeat;	background-position: center;} #okayfreedom.ring #okayfreedom_logo #ring {	background-image: url(' + chrome.extension.getURL('img/ring.png') + ');}#okayfreedom.error #okayfreedom_logo #error {	background-image: url(' + chrome.extension.getURL('img/error.png') + ');}#okayfreedom.loading #okayfreedom_logo #spinner {	background-image: url(' + chrome.extension.getURL('img/spinner.png') + ');}#okayfreedom #okayfreedom_logo #spinner {	-webkit-animation: NAME-1 1s infinite linear;}@-webkit-keyframes NAME-1 {	0%   {		-webkit-transform: rotate(0deg);	}		100% {		-webkit-transform: rotate(360deg);	}}');
	
	// create overlay
	var firstChild = document.body.firstChild;
	var oNewDiv = document.createElement("div");
	var oNewSpan = document.createElement("span");
	var oNewSpan1 = document.createElement("span");
	var oNewSpan2 = document.createElement("span");
	var oNewSpan3 = document.createElement("span");
	
	var oH1 = document.createElement("h1");
	oH1.setAttribute('class', 'okayfreedom_status');
	oH1.setAttribute('id', 'id_okayfreedom_status');
	var oH1Text = document.createTextNode(messagetext);
	oH1.appendChild(oH1Text);

	oNewSpan.setAttribute('id', 'okayfreedom_logo');
	
	oNewSpan1.setAttribute('id', 'spinner');
	oNewSpan2.setAttribute('id', 'ring');
	oNewSpan3.setAttribute('id', 'error');
	
	oNewSpan.appendChild(oNewSpan1);
	oNewSpan.appendChild(oNewSpan2);
	oNewSpan.appendChild(oNewSpan3);
	oNewDiv.setAttribute('id', 'okayfreedom');
	oNewDiv.setAttribute('class', type);
	oNewDiv.appendChild(oNewSpan);
	oNewDiv.appendChild(oH1);
	document.body.insertBefore(oNewDiv, firstChild);
	
	g_bInserted = 1;
}

function updateInfoDivMessage(messagetext, type)
{
	var div = document.getElementById('okayfreedom');
	if (div)
	{
		//~ console.log("*** found message");
		div.setAttribute('class', type);
		var h1 = document.getElementById('id_okayfreedom_status');
		h1.firstChild.nodeValue = messagetext;//chrome.i18n.getMessage("loading");
	}
	else
	{
		console.log("### didn't find message");
	}
}

var messageinserted = 0;

function checkBlockedDeferred(doc)
{
    var host = OKF.parseUri(doc.location.href).host;
    console.log('Checking if site is blocked... host: ' + host);
    if (doc.location.href.search(/bbc\.co\.uk.+/) != -1) // BBC iPlayer
    {
        // bbc iPlayer: <div id="emp-error" class="notinuk">
        console.log('On bbc.co.uk with blocked iPlayer, checking...');
        //setTimeout("checkBBC()", 1000);
        // BBC not working because outside-uk class is not set on load time
        var element = doc.getElementById('player'); // 2014-07-22 ASR old: emp-error');
        if (element)
        {
            console.log('Element: ');
            console.log(element);
            console.log("*** class: " + element.className);
            if (OKF.hasClass(element, 'outside-uk')) // 2014-07-22 ASR old: 'notinuk')
            {
                return { host : 'bbc.co.uk', par1 : '1', country : 'UK', info : 'On bbc.co.uk with blocked iPlayer' };
            }
        }
    }

    return null;
}

function checkBlocked(doc)
{
    var host = OKF.parseUri(doc.location.href).host;
    console.log('Checking if site is blocked... host: ' + host);

    if (doc.location.href.search(/google\.(de|com)/) != -1) // ignore google completely
    {
        return null;
    }

/*    else if (host == 'www.hulu.com')
    {
        //~ log.info('On hulu.com, checking further...');
        if (current_country != 'US')
        {
            //if (document.getElementById('int-warning popup'))
            {
                return { host : 'hulu.com', par1 : '1', country : 'US', info : '' };
            }
        }
    }*/
	if (doc.location.href.search(/youtube\.com.+/) != -1) // youtube
    {
        var divUnav = doc.getElementById('player-unavailable'); // 2014-07-22 ASR
        if (divUnav && !OKF.hasClass(divUnav, 'hid')) // 2014-07-22 ASR
        {
            if (!doc.getElementById('watch-video-info-form')) // ignore upload dialog
            {
                return { host : 'youtube.com', par1 : '1', country : 'US', info : 'Blocked youtube video found' };
            }
        }
    }        
    else if (doc.location.href.search(/tv\.com/) != -1)
    {
        //~ log.info('On tv.com, checking further...');
        if (current_country != 'US')
        {
            return { host : 'tv.com', par1 : '1', country : 'US', info : '' };
        }
    }
    else if (doc.location.href.search(/pandora\.com/) != -1)
    {
        //~ log.info('On pandora.com, checking further...');
        //~ log.info(document.getElementById('footer_restricted'));
        if (current_country != 'US')
        {
            //if (doc.getElementById('footer_restricted'))
            {
                return { host : 'pandora.com', par1 : '1', country : 'US', info : '' };
            }
        }
    }
    
    return null;
}

function unblock_success(message)
{
	//~ console.log('vpn connected, reloading... (message: "' + message + '"');
	
	updateInfoDivMessage(chrome.i18n.getMessage("reload"), 'ring');
	setTimeout('chrome.extension.sendMessage({msg: "reload#" + document.location.href}, function(response){});', 2200);
}

function unblock_error(message)
{
	updateInfoDivMessage(chrome.i18n.getMessage(message), 'error');
	//insertMessageBody(chrome.i18n.getMessage(message), 'error');
}
