define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var App = require("app");

	var MediaModel = Backbone.Model.extend({
		urlRoot: App.WPCOM.mediaBaseURL(),

		add: function(url) {
			this.url = this.urlRoot + "/new";

			this.save(
				{
					media_urls: url
				},
				{
					wait:       true,
					beforeSend: App.WPCOM.setBearer
				}
			);
		},

		parse: function(resp) {
			if (resp.media && resp.media.length) {
				return resp.media[0];
			}
			return resp;
		}
	});

	module.exports = MediaModel;
});
