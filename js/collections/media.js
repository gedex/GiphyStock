define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var App = require("app");

	var MediaCollection = Backbone.Collection.extend({
		initialize: function(options) {
			this.limit = options.limit || 20;
		},

		url: function() {
			return this.getBaseUrl() + "?number=" + this.limit;
		},

		getBaseUrl: function() {
			return "https://public-api.wordpress.com/rest/v1/sites/" + App.WPCOM.siteID + "/media";
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.media)) return resp.media;

			return this.models;
		}

	});

	module.exports = MediaCollection;
});
