// Create api namespaces
var Api = Api || {};
Api.DataStruct = Api.DataStruct || {};

var Stack = {};
Stack.implementation = function () {
	var self = this;

	self.__data = [];
	self.__size = 0;
};

Api.DataStruct.Stack = function () {
	this.implementation = new Stack.implementation();
};

Api.DataStruct.Stack.prototype.size = function () {
	return this.implementation.__size;
};

Api.DataStruct.Stack.prototype.push = function (value) {
	this.implementation.__data[this.implementation.__size++] = value;
};

Api.DataStruct.Stack.prototype.pop = function (value) {
	if (this.implementation.__size <= 0) return null;

	return this.implementation.__data[--this.implementation.__size];
};