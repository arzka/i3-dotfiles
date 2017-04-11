function GetTradeItems() {
	var items = new Array();
	
	//$('article div[class="tradepoll"]').each(function(index, item) {
	$('article div[class="tradepoll"] .buttonright').each(function(index, item) {
		items.push($(item).parent().parent());
		//items.push($(item));
		//items.push($(item).attr('id').split('trade')[1])
	});
	
	return items;
}

function SlowForEach(array, finishCallback, min, max) {
	var timeOffset = 0.0;
	
	Iterate(0, array, 0.0, min, max, finishCallback);
}

function Iterate(index, array, offset, offsetMin, offsetMax, finishCallback) {
	if(index >= array.length) {
		finishCallback();
		return;
	}
	
	offset += ((Math.random() * (offsetMax * 1000)) + (offsetMin * 1000));
	
	setTimeout(function() {
		var data = {
			index: index,
			item: array[index],
			collection: array
		};
		
		IterationCallback(data);
		
		Iterate(index + 1, array, offset, offsetMin, offsetMax, finishCallback);
	}, offset);
}

function IterationCallback(data) {
	//data.collection[data.index].find('.buttonright').click();
	//var code = data.collection[data.index].find('.buttonright').attr('onclick');
	//eval(code);
	var tradeId = data.item.attr('id').split('trade')[1];
	
	$.post('ajax/bumpTrade.php', 'trade=' + tradeId);
	
	data.item.find('.buttonright').hide();
	
	if(typeof console !== 'undefined') {
		console.log('bumped ' + tradeId);
	}
}

function BumpAllTrades() {
	SlowForEach(
		GetTradeItems(),
		function () {
			setTimeout(function() {
				window.location.reload(true);
			}, ((Math.random() * 2) + 30.2) * 1000 * 60);
			//window.location.reload(true);
			//setTimeout(BumpAllTrades, ((Math.random() * 40) + 31) * 1000 * 60);
		},
		0.1,
		0.9
	);
}

BumpAllTrades();