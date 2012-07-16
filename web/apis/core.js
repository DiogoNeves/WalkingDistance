// Create api namespaces
var Api = Api || {};
Api.Core = Api.Core || {};


Api.Core.WaitForSignal = function (signal, callback) {
	if (signal.value) return;

	var intervalId = setInterval(function () {
		if (signal.value) {
			clearInterval(intervalId);
			callback();
		}
	}, 10);
};

Api.Core.WaitForSignalArray = function (signals, callback) {
	var allSignaled = function () {
		var isWaiting = false;
		for (var i in signals) {
			if (signals[i] === false) {
				isWaiting = true;
				break;
			}
		}

		return !isWaiting;
	};

	if (allSignaled()) return;
	
	var intervalId = setInterval(function () {
		if (allSignaled()) {
			clearInterval(intervalId);
			callback();
		}
	}, 10);
};

function isValid (obj) {
	return obj != null && obj !== undefined;
}