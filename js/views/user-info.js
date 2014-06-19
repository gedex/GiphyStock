define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var App = require("app");

	var userInfoTemplate = require("text!templates/user-info.html");

	var UserInfoView = Backbone.View.extend({
		tpl: _.template(userInfoTemplate),

		render: function() {
			this.$el.html(this.tpl({app: App}));

			return this;
		}
	});

	module.exports = UserInfoView;
});
