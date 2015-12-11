/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _service = __webpack_require__(1);

	var _service2 = _interopRequireDefault(_service);

	var _mixin = __webpack_require__(7);

	var _mixin2 = _interopRequireDefault(_mixin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jwtDecode = __webpack_require__(2);

	var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

	var _ajax = __webpack_require__(6);

	var _ajax2 = _interopRequireDefault(_ajax);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var API_URL = 'http://localhost:8000/api/';
	var LOGIN_URL = API_URL + 'auth/login';
	var USER_URL = API_URL + 'users/';

	exports.default = {
	  user: {
	    authenticated: false,
	    username: "",
	    email: "",
	    id: ""
	  },

	  login: function login(ctx, creds, redirectUrl) {
	    var self = this;
	    var ajax = new _ajax2.default();

	    ajax.post(LOGIN_URL, creds).done(function (resp, xhr) {
	      // Set the token in localStorage
	      localStorage.setItem('token', resp.token);

	      // Update user object
	      self.user.authenticated = true;
	      self.getUserFromToken(resp.token);

	      // Redirect to specified url
	      window.location.href = redirectUrl;
	    }).error(function (resp, xhr) {
	      console.log(resp);
	    });
	  },
	  checkAuth: function checkAuth() {
	    var jwt = localStorage.getItem('token');
	    if (jwt) {
	      this.user.authenticated = true;
	      this.getUserFromToken(jwt);
	    } else {
	      this.user.authenticated = false;
	    }
	  },
	  getUserFromToken: function getUserFromToken(token) {
	    var decodedToken = (0, _jwtDecode2.default)(token);
	    var userId = decodedToken.sub;
	    this.getUser(userId);
	  },
	  getUser: function getUser(id) {
	    var url = USER_URL + id;
	    var self = this;
	    // GET request
	    var ajax = new _ajax2.default();

	    ajax.get(url).done(function (resp, xhr) {
	      // Update user object
	      self.user.username = resp.data.username;
	      self.user.email = resp.data.email;
	      self.user.id = resp.data.id;

	      console.log(self.user);
	    }).error(function (resp, xhr) {
	      console.log(resp);
	    });
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var base64_url_decode = __webpack_require__(3);
	var json_parse = __webpack_require__(5);

	module.exports = function (token) {
	  if (!token) {
	    throw new Error('Invalid token specified');
	  }
	  
	  return json_parse(base64_url_decode(token.split('.')[1]));
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Base64 = __webpack_require__(4);

	module.exports = function(str) {
	  var output = str.replace(/-/g, "+").replace(/_/g, "/");
	  switch (output.length % 4) {
	    case 0:
	      break;
	    case 2:
	      output += "==";
	      break;
	    case 3:
	      output += "=";
	      break;
	    default:
	      throw "Illegal base64url string!";
	  }

	  var result = Base64.atob(output);

	  try{
	    return decodeURIComponent(escape(result));
	  } catch (err) {
	    return result;
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	;(function () {

	  var
	    object =  true ? exports : this, // #8: web workers
	    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	    INVALID_CHARACTER_ERR = (function () {
	      // fabricate a suitable error object
	      try { document.createElement('$'); }
	      catch (error) { return error; }}());

	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  object.btoa || (
	  object.btoa = function (input) {
	    for (
	      // initialize result and counter
	      var block, charCode, idx = 0, map = chars, output = '';
	      // if the next input index does not exist:
	      //   change the mapping table to "="
	      //   check if d has no fractional digits
	      input.charAt(idx | 0) || (map = '=', idx % 1);
	      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	    ) {
	      charCode = input.charCodeAt(idx += 3/4);
	      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
	      block = block << 8 | charCode;
	    }
	    return output;
	  });

	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  object.atob || (
	  object.atob = function (input) {
	    input = input.replace(/=+$/, '')
	    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
	    for (
	      // initialize result and counters
	      var bc = 0, bs, buffer, idx = 0, output = '';
	      // get next character
	      buffer = input.charAt(idx++);
	      // character found in table? initialize bit storage and add its ascii value;
	      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	        // and if not first of each 4 characters,
	        // convert the first 8 bits to one ascii character
	        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	    ) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  });

	}());


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function (str) {
	  var parsed;
	  if (typeof JSON === 'object') {
	    parsed = JSON.parse(str);
	  } else {
	    parsed = eval('(' + str + ')');
	  }
	  return parsed;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**!
	 * ajax - v0.0.12
	 * Ajax module in Vanilla JS
	 * https://github.com/fdaciuk/ajax

	 * Sun Nov 29 2015 22:08:26 GMT-0200 (BRST)
	 * MIT (c) Fernando Daciuk
	*/
	!function(e,t){"use strict"; true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (t), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof exports?exports=module.exports=t():e.Ajax=t()}(this,function(){"use strict";function e(){var e={},t={};return t.methods={done:function(){},error:function(){},always:function(){}},e.get=function(e){return t.XHRConnection("GET",e,null)},e.post=function(e,n){return t.XHRConnection("POST",e,n)},e.put=function(e,n){return t.XHRConnection("PUT",e,n)},e["delete"]=function(e,n){return t.XHRConnection("DELETE",e,n)},t.XHRConnection=function(e,n,o){var r=new XMLHttpRequest,s="application/x-www-form-urlencoded";return r.open(e,n||"",!0),r.setRequestHeader("Content-Type",s),r.addEventListener("readystatechange",t.ready,!1),r.send(t.objectToQueryString(o)),t.promises()},t.ready=function(){var e=this,n=4;if(e.readyState===n){if(e.removeEventListener("readystatechange",t.ready,!1),t.methods.always.apply(t.methods,t.parseResponse(e)),e.status>=200&&e.status<300)return t.methods.done.apply(t.methods,t.parseResponse(e));t.methods.error.apply(t.methods,t.parseResponse(e))}},t.parseResponse=function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},t.promises=function(){var e={};return Object.keys(t.methods).forEach(function(n){e[n]=t.generatePromise.call(this,n)},this),e},t.generatePromise=function(e){return function(n){return t.methods[e]=n,this}},t.objectToQueryString=function(e){return t.isObject(e)?t.getQueryString(e):e},t.getQueryString=function(e){return Object.keys(e).map(function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])}).join("&")},t.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},e}return e});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _service = __webpack_require__(1);

	var _service2 = _interopRequireDefault(_service);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  route: {
	    canActivate: function canActivate() {
	      if (_service2.default.user.authenticated) {
	        return true;
	      } else {
	        window.location.href = "/!#/auth/login";
	      }
	    }
	  },

	  data: function data() {
	    return {
	      user: _service2.default.user
	    };
	  },

	  http: {
	    headers: {
	      Authorization: 'Bearer ' + localStorage.getItem('token')
	    }
	  }
	};

/***/ }
/******/ ]);