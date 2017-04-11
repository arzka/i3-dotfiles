// Copyright (c) 2015 Steganos Software GmbH
//
// LicenseName: Proprietary License

console.log('prefs loaded');

var OKF = OKF || { };

OKF.prefs = (function()
{
	this.setValue = function (aPrefString, aPrefType, aValue)
	{
		try
		{
			switch(aPrefType)
			{
				case "str":
					return localStorage.setItem(aPrefString, aValue);
					break;

				case "int":
					aValue = parseInt(aValue);
					return localStorage.setItem(aPrefString, aValue);
					break;

				case 'obj':
				  	return localStorage.setItem(aPrefString, JSON.stringify(aValue));
				  	break;				  	
				case "bool":
				default:
					if(typeof(aValue) == "string")
					{
						aValue = (aValue == "true");
					}
					return localStorage.setItem(aPrefString, aValue);
					break;
			}
		}
		catch(e)
		{
		}
		return null;
	}


	this.getValue = function(aPrefString, aPrefType, aDefault)
	{
		try
		{
			// console.log ( "getPrefValue(): (" + aPrefType + ") " + aPrefString );

			switch (aPrefType)
			{
				case "str":
					return localStorage.getItem(aPrefString);
					break;

				case "int":
					return localStorage.getItem(aPrefString);
					break;
				case 'obj':
					var str = localStorage.getItem(aPrefString);
					if ( str == undefined || str == '' || str == null)
						return aDefault;
				  	return JSON.parse(str);
				  	break;				  	

				case "bool":
				default:
					return localStorage.getItem(aPrefString);
					break;
			}
		}
		catch(e)
		{
			//Log.Debug ( "getPrefValue(): " + e );
			console.log( "getPrefValue(): " + e );
		}
		return aDefault;
	}


	this.hasValue = function(aPrefString)
	{
		try
		{
			return localStorage.getItem(aPrefString);
		}
		catch(e)
		{
			return false;
		}
	}

	this.setString = function(aPrefString, aValue) { return this.setValue(aPrefString, 'str', aValue); }
	this.setInt = function(aPrefString, aValue) { return this.setValue(aPrefString, 'int', aValue); }
	this.setBool = function(aPrefString, aValue) { return this.setValue(aPrefString, 'bool', aValue); }
	this.setObject = function(aPrefString, aValue) { return this.setValue(aPrefString, 'obj', aValue); }

	this.getString = function(aPrefString, aValue, aDefault) { return this.getValue(aPrefString, 'str', aValue, aDefault); }
	this.getInt = function(aPrefString, aValue, aDefault) { return this.getValue(aPrefString, 'int', aValue, aDefault); }
	this.getBool = function(aPrefString, aValue, aDefault) { return this.getValue(aPrefString, 'bool', aValue, aDefault); }
	this.getObject = function(aPrefString, aValue, aDefault) { return this.getValue(aPrefString, 'obj', aValue, aDefault); }

	return { setValue: this.setValue, getValue: this.getValue, hasValue: this.hasValue,
				setString: this.setString, setInt: this.setInt, setBool: this.setBool, setObject: this.setObject, 
				getString: this.getString, getInt: this.getInt, getBool: this.getBool, getObject: this.getObject  };

})();

