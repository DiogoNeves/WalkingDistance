var objectWrapper = function (self, func) {
	return function (args) {
		if (args != null && args !== undefined && !(args instanceof Array))
			args = [args];
		func.apply(self, args);
	};
}

var Game = {};
Game.implementation = function (level) {
	var self = this;

	self.processing = null;
	self.level = level;

	//
	// Private!
	//

	// Set to null if not debug
	self.__debug = {
		infoPoints: /*/false/*/true/**/,
		frameRate: /*/false/*/true/**/,
		extendRender: /*/false/*/true/**/,
		walkState: /*/false/*/true/**/,
		overlayState: /*/false/*/false/**/
	};
	//self.__debug = null;

	self.__now = 0; // Updated on every draw so all update functions are in sync

	self.__screen = { width: 400, height: 400 };

	self.__map = null;
	self.__state = null; // Used to keep state between iterations
	self.__stateMap = null; // Used for debug draw
	self.__goal = null;
};


Game.implementation.prototype.dist = function (point1, point2) {
	return this.processing.dist(point1.x, point1.y, point2.x, point2.y);
};

Game.implementation.prototype.mouseClicked = function () {
	var self = this;

	if (self.__goal == null) {
		var pos = { x: self.processing.mouseX, y: self.processing.mouseY };
		if (pos.x < self.__screen.width) // Account for when we're extending the canvas
			self.__goal = pos;
	}
};

Game.implementation.prototype.startGame = function() {
	var self = this;

	// Used to syncronise the loaders
	// This could probably be done with a counter but because I don't know if ++ is thread safe in js
	// I decided to go with a more expensive but safer approach...
	var loadedSignal = { value: false };

	// Load map
	self.__map = self.processing.loadImage(self.level.resources.map, 'png', function() {
		loadedSignal.value = true;
	});

	// Wait until we stop loading
	Api.Core.WaitForSignal(loadedSignal, function () {
		// Start main loop
		console.log('Loaded all resources, starting main loop');
		self.processing.draw = objectWrapper(self, self.draw);
		self.processing.mouseClicked = objectWrapper(self, self.mouseClicked);
		self.processing.loop();
	});
};

Game.implementation.prototype.drawInfoPoint = function (point, info, colour) {
	var self = this;
	
	if (!(self.__debug && self.__debug.infoPoints)) return;

	self.processing.pushStyle();
	self.processing.noStroke();
	
	self.processing.fill(colour);
	self.processing.ellipse(point.x, point.y, 5, 5);
	
	self.processing.textAlign(self.processing.CENTER);
	self.processing.text(info, point.x, point.y - 10);

	self.processing.popStyle();
};

// We're going to use self as our loop function
Game.implementation.prototype.draw = function() {
	var self = this;
	var p = self.processing;
	var debugRenderLeft = (self.__debug && self.__debug.extendRender) ? self.__screen.width : 0;
	var frontColour = 255;

	self.__now = p.millis();

	p.fill(frontColour);

	//
	// Normal render
	//

	// Draw map
	p.image(self.__map, 0, 0);

	//
	// Overlaying debug render
	//
	if (self.__debug && self.__debug.walkState) {
		if (debugRenderLeft > 0) {
			if (self.__debug.overlayState)
				p.image(self.__map, debugRenderLeft, 0);
			else {
				p.pushStyle();
				p.fill(255 - frontColour);

				p.rect(debugRenderLeft, 0, debugRenderLeft + self.__screen.width, self.__screen.height);

				p.popStyle();
			}
		}

		if (self.__goal != null && self.__goal !== undefined)
			self.drawInfoPoint(self.__goal, "Goal", 0xFF00FF00);
	}

	// And Frame Rate hoooo yeaaaahhhhh
	if (self.__debug && self.__debug.frameRate) {
		p.textAlign(p.LEFT);
		p.text(p.__frameRate, debugRenderLeft + 15, 15);
	}

	// Prototype warning
	p.pushStyle();
	p.textAlign(p.CENTER);
	p.textSize(14);
	p.text("DEMO PROJECT!", (self.__screen.width / 2) + debugRenderLeft, 25);
	p.popStyle();
};

// Registers all the methods we need to attach to processing and starts the game loop
Game.implementation.prototype.processingProxy = function (processing) {
	var self = this;
	self.processing = processing;

	// Processing setup
	processing.setup = function() {
		processing.noLoop();

		var realWidth = (self.__debug && self.__debug.extendRender) ? self.__screen.width * 2 : self.__screen.width;
		processing.size(realWidth, self.__screen.height);
		processing.smooth();
		processing.frameRate(30);

		self.startGame();
	};
};


// Ok, lets define the game api
var Api = Api || {};

Api.Game = function (level) {
	// TODO: Validate input
	this.implementation = new Game.implementation(level);
};

Api.Game.prototype.attachTo = function (canvas) {
	var self = this;
	new Processing(canvas, objectWrapper(self.implementation, self.implementation.processingProxy));
};


Api.Game.play = function (canvas, level, profile) {
	console.log('Starting level ' + level.name);

	var gameObj = new Api.Game(level);
	gameObj.attachTo(canvas);

	// TODO: This signals the start of the game

	return gameObj;
};

