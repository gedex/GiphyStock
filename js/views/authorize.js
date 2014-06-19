define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var App = require("app");

	var authorizeTemplate = require("text!templates/authorize.html");

	var AuthorizeView = Backbone.View.extend({
		tpl: _.template(authorizeTemplate),

		render: function() {
			this.$el.html(this.tpl({app: App}));

			return this;
		}
	});

	module.exports = AuthorizeView;
});
