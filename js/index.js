webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(6);
	/**
	 * get all pre tag parent first class
	 */
	var addData2Highlight = function () {
	    var highlightClass = document.getElementsByClassName('highlight');
	    Array.prototype.map.call(highlightClass, function (el) {
	        var parentClass = el.parentNode.classList;
	        var dataLang;
	        if (parentClass.length > 1) {
	            dataLang = parentClass[0].split('-')[1];
	            el.setAttribute('data-lang', dataLang);
	        }
	    });
	};
	window.onload = addData2Highlight;


/***/ },
/* 1 */
/***/ function(module, exports) {

	  
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-81238476-1', 'auto');
	  ga('send', 'pageview');


/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=index.js.map