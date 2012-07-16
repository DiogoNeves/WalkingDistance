// Create api namespaces
var Api = Api || {};
Api.Data = Api.Data || {};

// TODO: This should have the level loaders!

// Ok, lets define the data api
Api.Data.loadLevel = function (levelFilename, callback) {
	$.getJSON('levels/' + levelFilename, callback);
};

Api.Data.loadResource = function (resourceName, type, callback) {
	$.getJSON('levels/' + resourceName + '.' + type, callback);
};