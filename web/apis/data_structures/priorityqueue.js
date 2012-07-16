// Create api namespaces
var Api = Api || {};
Api.DataStruct = Api.DataStruct || {};


// Uses a Heap

var PriorityQueue = {};
PriorityQueue.implementation = function () {
	this.__size = 0;
	this.__data = [];
};

Api.DataStruct.PriorityQueue = function () {
	this.implementation = new PriorityQueue.implementation();
};

Api.DataStruct.PriorityQueue.prototype.size = function () {
	return this.implementation.__size;
};

Api.DataStruct.PriorityQueue.prototype.enqueue = function (value, weight) {
	if (value == null) return;

	var newElement = { v: value, w: weight };
	this.implementation.__data[this.implementation.__size] = newElement;

	var i = this.implementation.__size++;
	while (i > 0) {
		var pi = Math.floor((i - 1) * 0.5);
		var parent = this.implementation.__data[pi];
		var node = this.implementation.__data[i];

		if (node.w < parent.w) {
			// we have to move it up
			this.implementation.__data[pi] = node;
			this.implementation.__data[i] = parent;
			i = pi;
		}
		else {
			// Yeah, we found its place
			break;
		}
	}
};

Api.DataStruct.PriorityQueue.prototype.dequeue = function (value) {
	if (this.implementation.__size <= 0) return null;

	var node = this.implementation.__data[0];
	this.implementation.__data[0] = this.implementation.__data[--this.implementation.__size];

	var i = 0;
	while (i < this.implementation.__size) {
		var li = i * 2 + 1;
		var ri = i * 2 + 2;
		var parent = this.implementation.__data[i];
		var left = this.implementation.__data[li];
		var right = this.implementation.__data[ri];

		if (parent.w > left.w || parent.w > right.w) {
			// we have to move it down
			if (left.w < right.w) {
				this.implementation.__data[li] = parent;
				this.implementation.__data[i] = left;
				i = left;
			} else {
				this.implementation.__data[ri] = parent;
				this.implementation.__data[i] = right;
				i = right;
			}
		} else {
			// Yeah, we found its place
			break;
		}
	}

	return node.v;
};