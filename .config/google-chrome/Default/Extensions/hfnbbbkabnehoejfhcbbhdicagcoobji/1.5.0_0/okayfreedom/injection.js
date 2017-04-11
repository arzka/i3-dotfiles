// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

console.log('injection loaded');

var OKF = OKF || { };

OKF.injection = (function()
{
	var arrayContains = function(a, needle) 
	{
		for (var i=0; i<a.length; i++)
		{
	        if (a[i] == needle) 
	        {
	            return true;        
	        }
	    }
	    return false;
	}

	var injectScriptfile = function(doc, src)
	{
		var el = doc.createElement("script");
		el.setAttribute("type", "text/javascript");
		el.src = src;

		(doc.getElementsByTagName("head")[0] || doc.body).appendChild(el);	
		return el;
	}

	var injectScriptfileToBody = function(doc, src)
	{
		var el = doc.createElement("script");
		el.setAttribute("type", "text/javascript");
		el.src = src;

		doc.body.appendChild(el);
		return el;
	}

	var injectScript = function(doc, content)
	{
		var el = doc.createElement("script");
		el.setAttribute("type", "text/javascript");
		el.textContent = content;

		(doc.getElementsByTagName("head")[0] || doc.body).appendChild(el);	
		return el;
	}

	var injectScriptToBody = function(doc, content)
	{
		var el = doc.createElement("script");
		el.setAttribute("type", "text/javascript");
		el.textContent = content;

		doc.body.appendChild(el);	
	}

	var injectElement = function(doc, type, id, style)
	{
		var el = doc.createElement(type);
		el.id = id;
		el.style.cssText = !style ? 'display: none;' : style;
		doc.body.appendChild(el);
		return el;
	};

	var injectCiuvo = function(doc, productinfo, plugininfo)
	{
	    // THIS CODE INJECTS ADVERTISING TO FINANCE FREE TRAFFIC

//	    console.log(plugininfo);
	    var data = { 
	    	"wkz" : productinfo.wkz, 
	    	"infourl" : plugininfo.WEBSITE_PRICECHECK_INFO, //"https://www.okayfreedom.com",
	    	"urlbase" : chrome.extension.getURL('web/'),
	    	"extension_domain": chrome.extension.getURL('').replace(/\/$/, ""), // strip triling backslash
	    	"website_domain": doc.location.protocol + '//' + doc.domain,
	    	"extension_id": plugininfo.EXTENSION_ID,
	    };
	    
		injectScript(doc, 'var OKAYFREEDOM_CLIENTINFO = ' + JSON.stringify(data) + ';');
		injectScriptfile(doc, chrome.extension.getURL('web/ciuvo.js'));
	}

	var inject = function(doc, adInjections, productinfo, plugininfo) 
	{
		//adInjections = [ "cv" ]; // debug
		console.log('plugin: injection');

		var isSsl = doc.location.protocol == "https:";
		var href = doc.location.href;

		if (doc.getElementById("OKAYFREEDOM_INJECTED")) 
		{
			console.log('plugin: skip injection');
			return;
		}

	//	doc.body.style.background='LightGreen';
    	injectElement(doc, 'div', 'OKAYFREEDOM_INJECTED');
		console.log('plugin: injecting on ' + href);

		if (href.search(/steganos\.(de|com)/) != -1 || href.search(/okayfreedom\.(de|com)/) != -1) // nur auf steganos/okayfreedom
	    {
	    	console.log('We are on a steganos site -> skip ad injections');    	
	    	injectElement(doc, 'div', 'OKAYFREEDOM_ADDON_ACTIVE');
	    	return;
		}

		var isGoogle = href.search(/google\.(de|com)/) != -1;
		if (isGoogle) // ist google ? 
		{
	//		if (doc.location.href.search(/www.google\.(de|com)/) == -1) // und nicht www
	//		if (doc.location.href.search(/(search|webhp|\#q\=)\??/) == -1)
			// problem ist das auch eine suche von zB. www.google.com oder https://www.google.de/?gws_rd=ssl ausgeführt werden kann ohne das eine neue seite mit #q geladen wird
			// nun annahme: wenn hinter .com/ ein buchstabe kommt, also ein pfad, wird davon ausgegangen das es um zb calendar, mail etc geht. Für den Fall das kein Buchstabe sondern zb # oder ? kommt wird
			// von einer Suche ausgegangen

			var isNewTab = href.search(/chrome\/newtab/) != -1;
			var isSearch = href.search(/www.google\.[a-z]{2,3}\/(search|webhp)\?/) != -1;
			var hasPath = href.search(/google\.[a-z]{2,3}\/[a-z]/) != -1; //
			console.log('google: href: ' + href + ' isSearch: ' + isSearch + ' hasPath: ' + hasPath + ' isNewTab: ' + isNewTab);
			if (!isSearch && hasPath && !isNewTab)
			{
				console.log("google but no search page -> skip ads");
			    return;
		    }
		}

	//	console.log("okayfreedom inject");
		
//		console.log('adInjections ', adInjections);
		if (arrayContains(adInjections, 'ciu'))	injectCiuvo(doc, productinfo, plugininfo);
		if (!isGoogle)
		{
		}
	//	console.log("okayfreedom inject done");
	}

	return { inject: inject };

})();
