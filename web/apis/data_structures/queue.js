// Create api namespaces
var Api = Api || {};
Api.DataStruct = Api.DataStruct || {};


// Queue implemented using a list as we're going to have loads of removes and additions
// and we have no idea of the size we'll need ;)

var Queue = {};
Queue.implementation = function () {
	this.__inbox = new Api.DataStruct.Stack();
	this.__outbox = new Api.DataStruct.Stack();
};

Api.DataStruct.Queue = function () {
	this.implementation = new Queue.implementation();
};

Api.DataStruct.Queue.prototype.size = function () {
	return this.implementation.__inbox.size() + this.implementation.__outbox.size();
};

Api.DataStruct.Queue.prototype.enqueue = function (value) {
	if (value == null) return;

	this.implementation.__inbox.push(value);
};

Api.DataStruct.Queue.prototype.dequeue = function (value) {
	if (this.size() <= 0) return null;

	if (this.implementation.__outbox.size() <= 0) {
		// we need to move from inbox into outbox
		while (this.implementation.__inbox.size() > 0)
			this.implementation.__outbox.push(this.implementation.__inbox.pop());
	}

	return this.implementation.__outbox.pop();
};