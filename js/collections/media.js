define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var App = require("app");

	var MediaCollection = Backbone.Collection.extend({
		initialize: function(options) {
			this.limit = options.limit || 20;
		},

		url: function() {
			return App.WPCOM.mediaBaseURL() + "?number=" + this.limit;
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.media)) return resp.media;

			return this.models;
		}

	});

	module.exports = MediaCollection;
});
