// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

console.log('remoteConfig loaded');
console.log('OKF ', OKF);

var OKF = OKF || { };


// läd ein object von einem internet-server welches als JSON vorliegen muss

OKF.remoteConfig = (function()
{
	var _data = { };
	var _checkIsRunning = false;
	var _doReCheck = false; // in case of changed request values while check is running - repeat check afterwards
	var _getUrlCallback = null;
	var _onReqDone = null;


	var init = function(getUrlCallback, onReqDone, defaultdata)
	{
		_getUrlCallback = getUrlCallback;
		_onReqDone = onReqDone;
		_data = OKF.prefs.getObject('remoteConfig_data', 'defaultdata'); //datastr != '' ? JSON.parse(datastr) : defaultdata;		
	}

	var checkUpdate = function()
	{	
		if (!_checkIsRunning)
		{
			_checkIsRunning = true;

			var url = _getUrlCallback();
			console.log("RemoteConfig.url: " + url);

			var oReq = new XMLHttpRequest();
			
			oReq.onload = function () 
				{ 					
					if (this.status >= 200 && this.status < 300)
						reqListener(this.responseText);  
					else						
						console.log("Error on requesting url: " + this.responseURL + " status: " + this.status);
				};
			oReq.onerror = function(evt) 
				{ 
					console.log("Error on requesting url: " + url + " evt: ", evt);
				};

			oReq.open("get", url, true);
			oReq.send();
		}
	}

	var recheckUpdate = function()
	{	
		if (_checkIsRunning)
			_doReCheck = true;
		else
			checkUpdate();

	}

	var reqListener = function(responseText) 
	{
	  	console.log("RemoteConfig.reqListener: " + responseText);

	  	var data = JSON.parse(responseText);
	  	_data = data;
	  	OKF.prefs.setObject('remoteConfig_data', _data);
	  	if (_onReqDone != null)
	  		_onReqDone(responseText);
	  	_checkIsRunning = false;
	  	if (_doReCheck)
	  	{
	  		_doReCheck = false;
	  		checkUpdate();
	  	}
	}

	var getData = function()
	{
		return _data;
	}

	return { init: init, checkUpdate: checkUpdate, getData: getData, recheckUpdate: recheckUpdate };

})();