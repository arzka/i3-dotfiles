

function sallittusivusto(filter) {

	//alert("Filter: " + filter);
	
	for(var i=0; i < filter.length; i++) {

		if (filter[i][0] == document.defaultView.location.hostname) {
			return i;
			break;
		}
	}

	return -1;

};

function tuotesivu(index, filter) {

	//alert("sallittu domain!");
	
	var hakutyyppi = parseInt(filter[index][1]);
	var re = new RegExp(filter[index][2]);
	
	switch(hakutyyppi) {

		case 1:
			if (re.test(document.documentElement.innerHTML)) parsitaan_tuotesivu(index, filter);
			break;

		case 2:
			if (re.test(document.defaultView.location.hostname + document.defaultView.location.pathname)) parsitaan_tuotesivu(index, filter);
			break;

		default:
			alert("Hintahaku: Virheellinen hakutyyppi!");
			break;

	}

};

function parsitaan_tuotesivu(index, filter) {


	//alert("ollaan tuotesivulla!");
	
	var re = new RegExp(filter[index][3]);

	var hintare = new RegExp(filter[index][5]);

	var tuotekoodi = re.exec(document.documentElement.innerHTML);
	var hintateksti = hintare.exec(document.documentElement.innerHTML);

	//alert("Tuotekoodi: " + tuotekoodi + " , hintateksti: " + hintateksti + " , hinta-re: " + hintare);
	
	if ((tuotekoodi != null) && (hintateksti != null)) {

		hinta = parseFloat(hintateksti[1].replace("&nbsp;", "").replace(",", "."));

		lisataan_tuotenappi(index, filter, tuotekoodi[1], hintateksti[1], hinta);

	}


};

function lisataan_tuotenappi(index, filter, tuotekoodi, hintateksti, hinta) {

	//alert("napin lisays!");

	var nappi = document.createElement("div");
	nappi.setAttribute("class", "hstuotenappiclass");
	nappi.setAttribute("piilotettu", "1");
	nappi.setAttribute("style", "visibility: hidden;");

	document.getElementsByTagName("body")[0].appendChild(nappi);

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://hinta.fi/ajax.php?zm=product&zf=searchAutocomplete&term=" + tuotekoodi, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {

				if (xhr.status === 200) {

					var tiedot = xhr.responseText;

					//tiedot_hinta = parseFloat(tiedot[0].price.replace(",", "."));


					luonappi(index, filter, tuotekoodi, hintateksti, hinta, tiedot);
				

				}
		}
	};
	xhr.onerror = function (e) {
		alert("Hintahaku: Virhe haettaessa hintoja: " + xhr.statusText);
	};
	xhr.send(null);


};

function luonappi(index, filter, tuotekoodi, hintateksti, hinta, tiedot) {

	//alert("luonappi!");

	var taustakuva;
	var taustavari;
	var nappulateksti;
	var laatikkoteksti;

	if (tiedot.length > 0) {

		tiedot = JSON.parse(tiedot);

		tiedot_hinta = tiedot[0].price;
		tiedot_hinta = tiedot_hinta.replace(",", ".");
		tiedot_hinta = parseFloat(tiedot_hinta.replace(" ", ""));

		//tiedot_hinta = parseFloat(tiedot[0].price.replace(",", "."));

		
		laatikkoteksti = tiedot[0].value + ":<br>" + tiedot[0].storeCount + ", alin hinta: " + tiedot[0].price;

		if (tiedot_hinta < hinta) {
			nappulateksti = "<a style=\"color: white; text-decoration: none;\" href=\"http://hinta.fi" + tiedot[0].url + "\"><center>Hinta.fi löytyy halvempi hinta<br><font size=+2>" + tiedot[0].price + "</font></center></a>";
			taustavari = "rgb(1,159,0);";
			//taustakuva = "url(chrome-extension://__MSG_@@extension_id__/tausta_vihrea.png)";
			taustakuva = "url(" + chrome.extension.getURL("tausta_vihrea.png") + ")";

		} else {
			nappulateksti = "<a style=\"color: white; text-decoration: none;\" href=\"http://hinta.fi" + tiedot[0].url + "\"><center>Hinta.fi ei löydy halvempaa<br><font size=+2>" + tiedot[0].price + "</font></center></a>";
			taustavari = "rgb(209,21,26);";
			//taustakuva = "url(chrome-extension://__MSG_@@extension_id__/tausta_punainen.png)";
			taustakuva = "url(" + chrome.extension.getURL("tausta_punainen.png") + ")";

		}


	} else {

		//taustakuva = "url(chrome-extension://__MSG_@@extension_id__/tausta_punainen.png)";
		taustakuva = "url(" + chrome.extension.getURL("tausta_punainen.png") + ")";
		taustavari = "rgb(209,21,26);";
		nappulateksti = "<font size=+1>Hinta.fi ei hakutuloksia</font>";
		laatikkoteksti = "Hinta.fi ei hakutuloksia";

	}


	var kohdeel = document.getElementsByClassName(filter[index][7])[parseInt(filter[index][8])];
	var napintyyli = filter[index][9];
	
	napintyyli = napintyyli + " text-align: center; position: relative; background-image: " + taustakuva + ";";
	//napintyyli = napintyyli + " text-align: center; position: relative;";
	
	var nappi = document.getElementsByClassName("hstuotenappiclass")[0];
	nappi.setAttribute("style", napintyyli);
	
	var sisempi = document.createElement("div");
	sisempi.setAttribute("style", "margin: 0px; position: absolute; top: 50%; transform: translate(-50%, -50%); left: 50%; margin-right: -50%; color: white; text-decoration: none;");
	
	sisempi.innerHTML = nappulateksti;

	var infolaatikko = document.createElement("div");
	infolaatikko.setAttribute("style", "z-index: 1002; position: absolute; left: 0px; top: 105%; width: 100%; height: 100px; border-radius: 5px; color: white; text-decoration: none; visibility: hidden;" + " background-color: " + taustavari);
	infolaatikko.setAttribute("class", "hsinfolaatikkoclass");

	var sisempi_info = document.createElement("div");
	sisempi_info.setAttribute("style", "margin: 0px; position: absolute; top: 50%; transform: translate(-50%, -50%); left: 50%; margin-right: -50%; color: white; text-decoration: none;");

	sisempi_info.innerHTML = laatikkoteksti;

	infolaatikko.appendChild(sisempi_info);
	
	nappi.appendChild(sisempi);
	nappi.appendChild(infolaatikko);
	kohdeel.appendChild(nappi);

	nappi.addEventListener("mouseenter", function(e) { hiiripaalla(e); }, false);
	nappi.addEventListener("mouseleave", function(e) { hiiripoispaalta(e); }, false);


};

function hiiripaalla(evt) {

	evt.target.getElementsByClassName("hsinfolaatikkoclass")[0].style.visibility = "visible";


};

function hiiripoispaalta(evt) {

	evt.target.getElementsByClassName("hsinfolaatikkoclass")[0].style.visibility = "hidden";


};

function palautusfunktio(filter) {

	//filter = palautus;
	//alert("Sallittu sivusto: " + sallittusivusto());
	
	var ok = sallittusivusto(filter);
	
	//alert("sallittu sivusto: " + ok);
	
	if (ok != -1) {
	
		tuotesivu(ok, filter);
	
	}
	
	

};




chrome.extension.sendRequest({}, palautusfunktio);
