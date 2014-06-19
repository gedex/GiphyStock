define(function(require, exports, module) {
	"use strict";

	var $ = require("jquery");
	var Backbone = require("backbone");
	var Masonry = require("masonry");

	var searchTemplate = require("text!templates/search.html");
	var searchResultsTemplate = require("text!templates/search-results.html");
	var searchInfoTemplate = require("text!templates/search-info.html");
	var loadMoreButton = '<button type="button" class="btn btn-primary btn-lg btn-block" id="next-result">Load More</button>';

	var SearchView = Backbone.View.extend({
		keyword: "",
		tpl: _.template(searchTemplate),

		className: "row",

		events: {
			"submit #s":           "searchOnSubmit",
			"click #next-result":  "nextResult",
			"mouseover .gif":      "animate",
			"mouseout .gif":       "stillImage"
		},

		initialize: function(options) {
			this.router = options.router;

			this.keyword = options.keyword || "";
			this.offset = options.offset || 0;
		},

		searchOnSubmit: function(e) {
			var keyword = $("#search").val();

			e.preventDefault();
			e.stopPropagation();

			if (!_.isEmpty(keyword)) {
				this.router.navigate("search/" + keyword + "/0", {trigger: true});
			}
		},

		search: function(keyword, offset) {
			this.keyword = keyword;
			this.offset = offset || this.offset;

			if (_.isEmpty(this.keyword)) return;

			this.showSearchLoading();

			this.collection.search(this.keyword, this.offset);
			this.collection.once("sync", this.renderAfterSync, this);
		},

		nextResult: function(e) {
			this.$el.find("#load-more-container").html("");
			this.showSearchLoading();

			if (!this.collection.hasNextResult()) return;

			this.collection.nextResult(this.keyword);
			this.collection.once("sync", this.renderAfterSync, this);
		},

		renderAfterSync: function() {
			this.hideSearchLoading();
			this.renderResults();
		},

		render: function() {
			this.$el.html(this.tpl({
				keyword: this.keyword
			}));

			this.renderResults();

			return this;
		},

		renderResults: function() {
			var results = $(this.getResults()).filter(".gif-link").get();

			// Append search results.
			this.$el.find("#search-results").append(results);

			// Mansory for tiled search results.
			if (!_.isEmpty(this.collection.models)) {
				if (!this.masonry) {
					this.masonry = new Masonry("#search-results");
				} else {
					this.masonry.appended(results);
				}

				this.$el.find("#search-info").html(
					_.template(searchInfoTemplate, {
						keyword: this.keyword,
						total: this.collection.totalSearchResults()
					})
				);
			}

			if (this.collection.hasNextResult()) {
				$("#load-more-container").html(loadMoreButton);
			}
		},

		getResults: function() {
			return _.template(searchResultsTemplate, {
				gifs: this.collection.toJSON()
			});
		},

		showSearchLoading: function() {
			this.$el.find(".search-loading").show();
		},

		hideSearchLoading: function() {
			this.$el.find(".search-loading").hide();
		},

		animate: function(e) {
			var el = $(e.target);
			var anim = el.data("anim");
			var parent = el.parent();
			var loader = parent.find(".loader");

			if (!loader.length) {
				parent.append('<div class="loader">Loading...</div>');
			}

			el.addClass("loading").on("load", this.removeLoader);
			el.addClass("loading").on("error", this.removeLoader);

			el.attr("src", anim);
		},

		stillImage: function(e) {
			var el = $(e.target);
			var still = el.data("still");

			this.removeLoader(e);

			el.off("load");
			el.off("error");

			el.attr("src", still);
		},

		removeLoader: function(e) {
			var el = $(e.target);
			var parent = el.parent();

			el.removeClass("loading");
			parent.find(".loader").remove();
		}
	});

	module.exports = SearchView;
});
