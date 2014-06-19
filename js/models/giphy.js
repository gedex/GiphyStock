define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var GiphyModel = Backbone.Model.extend({
		urlRoot: "http://api.giphy.com/v1/gifs"
	});

	module.exports = GiphyModel;
});
