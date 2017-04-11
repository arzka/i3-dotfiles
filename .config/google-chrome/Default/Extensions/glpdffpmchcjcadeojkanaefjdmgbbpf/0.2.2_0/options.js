function tallenna_asetukset() {
  var filterurl = document.getElementById('filterurl').value;

  chrome.storage.local.set({
    filter_asetukset: filterurl
  }, function() {

    var status = document.getElementById('status');
    status.textContent = 'Asetukset tallennettu.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function lataa_asetukset() {

  chrome.storage.local.get({
    filter_asetukset: "http://olli.wtf/hintahaku/filter.txt"
  }, function(items) {
    document.getElementById('filterurl').value = items.filter_asetukset;
  });
}
document.addEventListener('DOMContentLoaded', lataa_asetukset);
document.getElementById('save').addEventListener('click',
    tallenna_asetukset);