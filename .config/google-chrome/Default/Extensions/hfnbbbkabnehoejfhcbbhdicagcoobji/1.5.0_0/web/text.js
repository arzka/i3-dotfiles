
// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

var t = null;
	
function Text(textresource)
{
	this.text = textresource.text;
	this.lang = navigator.language || navigator.userLanguage;
	this.fallbackLang = 'en';
	this.wkz = '';
	this.wkzOverride = textresource.wkzOverride;
	this.productname = textresource.productname;
	this.productname_short = textresource.productname_short;
	
	this.setLanguage = function(lang)
	{
		this.lang = lang;
	};
	
	this.get = function(textId, replacements)
	{
		replacements = typeof replacements == "undefined" ? {} : replacements;

		var ret = '';
		if (this.wkz in this.wkzOverride)			
		{
			var wkzOverride = this.wkzOverride[this.wkz];
			if (this.lang in wkzOverride && textId in wkzOverride[this.lang])
				ret = wkzOverride[this.lang][textId];
		}
		if (ret == '')
		{
			if (this.lang in this.text && textId in this.text[this.lang])
				ret = this.text[this.lang][textId];
			else if (textId in this.text[this.fallbackLang])
				ret = this.text[this.fallbackLang][textId];
			else
				ret = textId;
		}
		ret = ret.replace('{{productname}}', this.productname);
		ret = ret.replace('{{productname_short}}', this.productname_short);
		for (key in replacements)
		{
			ret = ret.replace('{{'+key+'}}', replacements[key]);
		}
		return ret;
	};

	this.getResLanguage = function()
	{
		// returns supported language. if set language is not available default-lang ist returned
		return this.lang in this.text ? this.lang : this.fallbackLang;
	}
}