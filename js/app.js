define(function(require, exports, module) {
	"use strict";

	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");

	var App = module.exports;

	App.ROOT = "/";

	App.WPCOM = {
		clientID: "35179",
		redirectURL: window.location.origin,

		// Based on Sulfur
		auth: {
			accessToken: localStorage.getItem("access_token"),
			siteID: localStorage.getItem("site_id")
		},

		setBearer: function(xhr) {
			xhr.setRequestHeader("Authorization", "BEARER " + App.WPCOM.auth.accessToken);
		},

		mediaBaseURL: function() {
			return "https://public-api.wordpress.com/rest/v1/sites/" + App.WPCOM.auth.siteID + "/media";
		}
	};

	App.Giphy = {
		baseURL: "http://api.giphy.com/v1/gifs",
		apiKey: "dc6zaTOxFJmzC",
	};

});
