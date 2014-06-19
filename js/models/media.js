define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var MediaModel = Backbone.Model.extend({
		initialize: function() {
			if (!_.isUndefined(this.collection)) {
				this.urlRoot = this.collection.getBaseUrl();
			}
		}
	});

	module.exports = MediaModel;
});
