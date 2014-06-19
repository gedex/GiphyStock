define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var App = require("app");
	var GiphyModel = require("models/giphy");

	var GiphyCollection = Backbone.Collection.extend({
		model: GiphyModel,

		initialize: function(options) {
			this.keyword = options.keyword || "";
			this.offset = parseInt(options.offset, 10) || 0;
			this.nextOffset = this.offset;
			this.limit = options.limit || 25;

			this.count = 0;
		},

		search: function(keyword, offset) {
			this.keyword = keyword;
			this.offset = offset || this.offset;
			this.url = this.getBaseURL() + "/search";

			this.fetch({
				data: $.param({
					q: this.keyword,
					offset: this.offset,
					limit: this.limit,
					api_key: App.Giphy.apiKey
				})
			});
		},

		nextResult: function() {
			if (this.hasNextResult()) {
				this.offset = this.nextOffset;
				this.search(this.keyword);
			}
		},

		hasNextResult: function() {
			return (this.total_count > this.nextOffset && !_.isEmpty(this.keyword));
		},

		totalSearchResults: function() {
			return this.total_count;
		},

		getBaseURL: function() {
			return App.Giphy.baseURL;
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.pagination) && resp.pagination.count) {
				this.count = resp.pagination.count;
				this.total_count = resp.pagination.total_count;
				this.nextOffset = parseInt(this.offset, 10) + parseInt(this.count, 10);
			}

			if (!_.isUndefined(resp.data)) {
				return resp.data;
			}

			return this.models;
		}

	});

	module.exports = GiphyCollection;
});
