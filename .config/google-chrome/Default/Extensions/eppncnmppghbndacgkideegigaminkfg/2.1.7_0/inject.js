var videoCount;

var assets = ["/media/output.webm", "/media/output1.webm", "/media/output2.webm", "/media/output3.webm"]
var videoEl = document.querySelector('.shia-do-it .shia-do-it--container video');
if (videoEl == null) {
	var videoCount = 0;
	var div = document.createElement('div');
	document.body.appendChild(div);
	div.className = 'shia-do-it';
	div.style.cssText = ('position: fixed; bottom: 0px; z-index: 99999; right: 0px; height: 530px; width: 720px; pointer-events: none;');
	div.innerHTML = '<div class="shia-do-it--container" style="width: 720px; overflow:hidden; display:block; height: 535px;"><video width="960" height="540" style="margin-top: -5px; max-width: none; padding: 0;" name="media"><source type="video/webm"></video></div>';
}


var video = document.querySelector('.shia-do-it .shia-do-it--container video');
video.style.opacity = "0";
video.style.cssText = ('transition: opacity 200ms;');
video.src = chrome.extension.getURL(assets[videoCount]);
if(videoCount < 3) {
	videoCount ++;
} else {
	videoCount = 0;
}
video.load();
video.addEventListener('loadeddata', function() {
	 video.currentTime = 0;
	 video.style.opacity = "1";
   video.play();
}, false);

video.onended = function() {
	video.style.opacity = "0";
};

video.onerror = function() {
  	alert("Chrome blocks Shia on this page:( Try on another one!");
};
