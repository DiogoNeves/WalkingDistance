// Create api namespaces
var Api = Api || {};
Api.DataStruct = Api.DataStruct || {};


// Queue implemented using a list as we're going to have loads of removes and additions
// and we have no idea of the size we'll need ;)

var Queue = {};
Queue.implementation = function () {
	var self = this;

	self.__head = null;
	self.__tail = null;
	self.__size = 0;
};

Api.DataStruct.Queue = function () {
	this.implementation = new Queue.implementation();
};

Api.DataStruct.Queue.prototype.size = function () {
	return this.implementation.__size;
};

Api.DataStruct.Queue.prototype.enqueue = function (value) {
	if (value == null) return;

	// Add to tail
	++this.implementation.__size;
	var newElement = { data: value, next: null };
	if (this.implementation.__tail != null)
		this.implementation.__tail.next = newElement;
	this.implementation.__tail = newElement;

	// If this is the first element, set the tail as well
	if (this.implementation.__head == null)
		this.implementation.__head = this.implementation.__tail;
};

Api.DataStruct.Queue.prototype.dequeue = function (value) {
	if (this.implementation.__size <= 0) return null;

	--this.implementation.__size;
	var head = this.implementation.__head;
	this.implementation.__head = head.next;
	head.next = null;

	return head.data;
};