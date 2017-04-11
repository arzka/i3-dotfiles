// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

var OKF = OKF || { };

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

OKF.parseUri = function(str) {
	var	o   = OKF.parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
	return uri;
};

OKF.parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

OKF.hasClass = function(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

OKF.addCss = function(doc, cssCode)
{
	var el = doc.createElement("style");
	el.type = "text/css";
	if (el.styleSheet)
	{
		el.styleSheet.cssText = cssCode;
	} 
	else 
	{
		el.appendChild(doc.createTextNode(cssCode));
	}
	doc.getElementsByTagName("head")[0].appendChild(el);
}

OKF.addJavaScript = function(doc, jsCode)
{
	var el = doc.createElement("script");
	el.type = "text/javascript";
	el.appendChild(_doc.createTextNode(jsCode));
	doc.getElementsByTagName("head")[0].appendChild(el);
}
