/*Copyright (c) 2017 ksoft http://www.dummysoftware.com*/function isRegistered(){var e=protect(localStorage.Expression);return 0==e.indexOf("^O")&&e.indexOf("0$")==e.length-2}function validateRegistrationCode(){if(validateRegistrationForm()){var e=document.querySelector("#txtCode").value.trim(),t=document.querySelector("#dialog-message-icon"),n=getUrlResponse("http://www.dummysoftware.com/cgi-bin/checkregcode_easyautorefresh.pl?"+e);if(null!=n&&"OK"==JSON.parse(n).result){localStorage.Expression=protect("^O"+e+"0$");dataSync();t.classList.remove("ui-icon-circle-close"),t.classList.add("ui-icon-circle-check")}else t.classList.add("ui-icon-circle-close");document.querySelector("#dialog-message-text").innerHTML=JSON.parse(n).message;var o=document.querySelector("#dialog-message");o.removeEventListener("click",onDialogMessageClick),o.addEventListener("click",onDialogMessageClick),fadeIn(o)}}function onDialogMessageClick(){fadeOut(document.querySelector("#dialog-message"))}function getUrlResponse(e){var t,n=new XMLHttpRequest;return n.open("GET",e,!1),n.onload=function(){n.status>=200&&n.status<400?t=n.responseText:alert("Error connecting to web server. Please check your Internet connection and try again. (A1)")},n.onerror=function(){alert("Error connecting to web server. Please check your Internet connection and try again. (B1)")},n.send(),t}function protect(e){var t=7,n="";if(null!=e)for(i=0;i<e.length;++i)n+=String.fromCharCode(t^e.charCodeAt(i));return n}