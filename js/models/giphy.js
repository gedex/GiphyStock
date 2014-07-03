define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var GiphyModel = Backbone.Model.extend({
		urlRoot: "http://api.giphy.com/v1/gifs",
		parse: function(resp) {
			if (!_.isUndefined(resp.data)) {
				return resp.data;
			}

			return resp;
		}
	});

	module.exports = GiphyModel;
});
