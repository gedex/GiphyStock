define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var UserModel = Backbone.Model.extend({
		url: "https://public-api.wordpress.com/rest/v1/me/?meta=site"
	});

	module.exports = UserModel;

});
