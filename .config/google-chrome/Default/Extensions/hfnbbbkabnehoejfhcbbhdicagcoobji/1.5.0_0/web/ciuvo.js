(function() {

    function getDisplayOffers(offers)
    {
        var ret = [];
        if (!offers.hasOwnProperty('Product')) {
            return ret;
        }

        for (var i = 0; i < offers.Product.offers.length; i++) 
        {       
            var offer = offers.Product.offers[i];   
            if (!offer.hasOwnProperty('saving')) {
                    continue;
            }
            ret.push(offer);
        }
/*        if (!offers.hasOwnProperty('Hotel')) {
            return ret;
        }

        for (var i = 0; i < offers.Hotel.offers.length; i++) 
        {       
            var offer = offers.Product.offers[i];   
            if (!offer.hasOwnProperty('saving')) {
                    continue;
            }
            ret.push(offer);
        }
        */
        ret.sort(function(a,b) { return a.sortorder - b.sortorder});        
        return ret;
    }

    //var script_source = "https://ciuvo.com/media/bookmarklet/ciuvo-addon-sdk.min.js";
    var DEBUG = false;

    function OFinject(displayoffers)
    {
        var doc = document;

        doc.documentElement.style.marginTop = "46px";

        var container = doc.createElement("iframe");
        container.className = "steg-container";

        container.style.cssText = "opacity: 1.0; "
          + "min-width : 1200px; left: 0; top: 0; width: 100%; height: 46px; z-index: 100000; position: fixed; border: 0;"; // background-color: #006DE0;
        container.src = OKAYFREEDOM_CLIENTINFO.urlbase + 'leaderboard.html';
        container.onload = function() {
            console.log('container.onload');
            container.contentWindow.postMessage({ "clientinfo": OKAYFREEDOM_CLIENTINFO, "displayoffers" : displayoffers }, '*');//OKAYFREEDOM_CLIENTINFO.extension_domain);
        };


        window.addEventListener("message",  function(event)
            {            
                if (event.origin != OKAYFREEDOM_CLIENTINFO.extension_domain && !DEBUG)
                {
                    return;
                }
                console.log('parent message received: ' + event.data);
                var d = event.data;
                if (d.id != OKAYFREEDOM_CLIENTINFO.extension_id)
                {
                    return;                
                }
                if (d.action == 'close')
                {
                    document.documentElement.style.marginTop = "0px";
                    container.style.display = 'none';
                }
                else if (d.action == 'showmore')
                {
                    container.style.height = '100%';
                }
                else if (d.action == 'hidemore')
                {
                    container.style.height = '46px';
                }
                else if (d.action == 'openlink')
                {
                    // not used anymore because of popup-blocking-message in FF
                    window.open(d.url,'_blank');
                }
            }
            , false);

        doc.documentElement.appendChild(container);
    }

    if (typeof TEST != 'undefined' && TEST)
    {
        OFinject(displayoffers); // displayoffers is global in test
        return;
    }
    
    var script_source = OKAYFREEDOM_CLIENTINFO.urlbase + "libs/ciuvo-addon-sdk.min.js";
    var script = document.body.appendChild(document.createElement('script'));

    script.async = true;
    script.src = script_source;
    script.onload = function() {
        /**
          * NOTE: The values for "base_url" and "tag" are provided by us.
          */
          //console.log("OKAYFREEDOM_CLIENTINFO" + OKAYFREEDOM_CLIENTINFO);
        var page = new ciuvoSDK.ConnectedPage(window.document, {
            "base_url": "https://steganos-api.ciuvo.com/api/", //https://stage.ciuvo.com/api/",
            "tag": "S434aN05",
            'campaign': OKAYFREEDOM_CLIENTINFO.wkz,  // Optional parameter to identify campaigns
            'uuid': ""  // Optional unique user identifier
        });
        page.on('offers', function(offers) {
  //          console-log("TEST!!!!");
           //console.log(JSON.stringify(offers));
           var displayoffers = getDisplayOffers(offers);
            var bShow = displayoffers.length > 0;
            if (bShow)
            {
                console.log(JSON.stringify(displayoffers));
                OFinject(displayoffers);
            }
        });
        page.on('error', function(error) {
            console.log("An error occurred: " + error);
        });
        page.on('finalize', function() {
            console.log("Finalize called");
        });

        // call once DOM is ready.
        page.load();
    };

    this.inIframe = function() 
    {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
  }


})();