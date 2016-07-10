webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var bb = 5;
	var Greeter = (function () {
	    function Greeter(greeting) {
	        this.greeting = greeting;
	    }
	    Greeter.prototype.greet = function () {
	        return "<h1>" + this.greeting + "</h1>";
	    };
	    return Greeter;
	}());
	;
	var greeter = new Greeter("Hello, world!");
	//document.body.innerHTML = greeter.greet();
	var s = __webpack_require__(1);
	//let h = require('../_layouts/default.pug');
	console.log('js works');
	console.log('hash works');


/***/ }
]);
//# sourceMappingURL=index-8bb245d1.js.map