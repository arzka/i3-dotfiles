var stores=function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=345)}({135:function(e,t,r){"use strict";function n(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var a=t[o](i),s=a.value}catch(e){return void r(e)}return a.done?void e(s):Promise.resolve(s).then(function(e){n("next",e)},function(e){n("throw",e)})}return n("next")})}}Object.defineProperty(t,"__esModule",{value:!0});var o=r(8),i=r.n(o),a=r(24),s=r(23);r.d(t,"createStoresList",function(){return l});var u=this,c=function(){var e={};i.a.each(i()(".store-item input"),function(t,r){e[r.id]=i()(r).prop("checked")}),a.a.set({stores:e})},l=function(){var e=n(regeneratorRuntime.mark(function e(t){var r,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=i()("#stores_list"),e.next=3,a.a.get({stores:s.a.stores});case 3:n=e.sent,t.forEach(function(e){var t=i()('\n      <div class="store-item" style="color: '+e.color+';">\n        <input type="checkbox" id="'+e.id+'">\n        <label for="'+e.id+'">'+e.title+"</label>\n      </div>");i()(t).find("#"+e.id).prop("checked",n.stores[e.id]),i()(t).on("change","#"+e.id,function(){c()}),r.append(t)});case 5:case"end":return e.stop()}},e,u)}));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i()("#ck_allStores").change(function(e){var t=i()(e.target).prop("checked");i()("#stores_list").toggle(!t),t||c()});case 1:case"end":return e.stop()}},e,u)}));return function(){return e.apply(this,arguments)}}();t.default=f()},23:function(e,t,r){"use strict";r.d(t,"b",function(){return n});var n={owned:"#9CCC65",wishlist:"#29B6F6"},o={sound:"offersound.ogg",soundvolumn:100,resultnumber:10,historypagesize:10,showbookmarks:!0,shownotify:!0,shownotify_friend:!1,shownotify_comment:!1,quickbuybuttons:!1,quicksellbuttons:!0,instantsellbuttons:!1,selectallbuttons:!0,buysetbuttons:!0,inventoryprice:!0,offertotalprice:!1,steamrep:!0,totalrow:!0,fastdelta:-.01,delaylistings:200,offerdelay:!0,autocheckofferprice:!0,offerdelayinterval:100,currency:"",currency_code:"",currency_rates:{},lang:"",lastIdx:0,totalMinus:0,totalPlus:0,totalRows:0,usevector:!1,simplyinvent:!1,customsound:"",ignorefriend:0,blockfriend:0,ignoredfriends:0,blockedfriends:0,privateblock:!1,privateignore:!1,autodecline:!0,highlight:!0,quickaccept:!1,quickacceptprompt:!0,quickrefuse:!1,quickrefuseprompt:!0,hidedefaultprice:!1,qadelay:10,qrdelay:10,gpdelayscc:2500,gpdelayerr:5e3,agp_hover:!0,agp_gem:!0,agp_sticker:!0,extprice:!0,extmasslisting:!1,extbgcolor:"#0000FF",exttextcolor:"#FFFFFF",extcustom:[],apikey:"",show_permalink:!0,show_streamlink:!0,show_float_value:!0,show_historical_price:!0,show_current_price:!0,show_all_stores:!0,stores:{amazonus:!0,battlenet:!0,bundlestars:!0,coinplay:!0,desura:!0,direct2drive:!0,dlgamer:!0,dotemu:!0,fireflower:!0,gamebillet:!0,gamersgate:!0,gamesplanet:!0,gamesplanetde:!0,gamesplanetfr:!0,gamesrepublic:!0,gog:!0,humblestore:!0,humblewidgets:!0,imperialgames:!0,impulse:!0,indiegalastore:!0,indiegamestand:!0,macgamestore:!0,newegg:!0,nuuvem:!0,origin:!0,playfield:!0,silagames:!0,squenix:!0,steam:!0,uplay:!0,wingamestore:!0},show_regional_price:!0,regional_countries:["us","gb","fr","jp","ru","br"],owned:{show:!0,color:n.owned},wishlist:{show:!0,color:n.wishlist},tradableinfo:!1};t.a=o},24:function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=r(23),i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=void 0;a=void 0!==window.chrome&&{}.hasOwnProperty.call(chrome,"storage")?chrome.storage.sync:localStorage;var s=void 0;s=void 0!==window.chrome&&{}.hasOwnProperty.call(chrome,"storage")?a.get:a.getItem;var u=void 0;u=void 0!==window.chrome&&{}.hasOwnProperty.call(chrome,"storage")?a.set:a.setItem;var c=JSON.parse(localStorage.getItem("options"))||o.a,l=function(){function e(){n(this,e)}return i(e,null,[{key:"get",value:function(e){return new Promise(function(t){return s(e,function(e){return t(e)})})}},{key:"set",value:function(e){return new Promise(function(t){return u(e,function(e){return t(e)})})}},{key:"clear",value:function(){a.clear()}}]),e}();t.a=l;(function(){function e(){n(this,e)}return i(e,null,[{key:"get",value:function(e){var t={};if("string"==typeof e)t[e]=void 0!==c[e]?c[e]:"";else if(e instanceof Object)Object.keys(e).forEach(function(r){t[r]=void 0!==c[r]?c[r]:e[r]});else{if(!Array.isArray(e))throw Error("Parameters should be only next types: String, Array or Object");e.forEach(function(r){t[r]=void 0!==c[r]?c[r]:e[r]})}return t}},{key:"getAll",value:function(){return c}},{key:"set",value:function(e){Object.assign(c,e),localStorage.setItem("options",JSON.stringify(c))}}]),e})()},345:function(e,t,r){e.exports=r(135)},8:function(e,t){e.exports=jQuery}});