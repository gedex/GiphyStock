define(function(require, exports, module) {
	"use strict";

	var $ = require("jquery");
	var Backbone = require("backbone");

	var App = require("App");

	var GiphyCollection = require("collections/giphy");
	var UserModel = require("models/user");

	var SearchView = require("views/search");
	var AuthorizeView = require("views/authorize");

	var userInfoTemplate = require("text!templates/user-info.html");

	var Router = Backbone.Router.extend({
		routes: {
			"authorize":               "authorize",
			"logout":                  "logout",
			"access_token=*fragment":  "getAuthFragment", // Copied form sulfur.

			"search":                  "search",
			"search/:keyword":         "search",
			"search/:keyword/:offset": "search",
			"*path":                   "search"
		},

		currentView: null,

		initialize: function() {
			this.$main = $("#main");

			this.giphyCollection = new GiphyCollection({
				limit: 25
			});

			this.maybeRenderUserInfo();

			this.watchDogID = setInterval($.proxy(this, 'watchDog'), 60000);
		},

		watchDog: function() {
			var originalHandler = this.onErrorFetchUserInfo;
			var self = this;
			var errHandler = function(xhr, status, err) {
				originalHandler.apply(self, arguments);
			};

			if (!this.isAuthorized()) {
				return false;
			}

			if (this.userInfo && _.isFunction(this.userInfo.fetch)) {
				this.userInfo.fetch({
					beforeSend: App.WPCOM.setBearer,
					error: errHandler
				});
			}
		},

		authorize: function() {
			this.currentView = new AuthorizeView();

			this.$main.html(this.currentView.render().el);
		},

		logout: function() {
			localStorage.removeItem("access_token");
			localStorage.removeItem("site_id");

			$("#user-info").html("");

			this.navigate("authorize", {trigger: true});
		},

		getAuthFragment: function() {
			// Extract the auth details from the # fragment returned by the API
			var resp = _.object(
				_.compact(
					_.map( location.hash.slice( 1 ).split( '&' ), function ( item ) {
						if ( item ) {
							return item.split( '=' );
						}
					} )
				)
			);

			localStorage.setItem("access_token", decodeURIComponent( resp.access_token ));
			localStorage.setItem("site_id", resp.site_id);

			this.maybeRenderUserInfo();

			this.navigate("search", {trigger: true});
		},

		maybeRenderUserInfo: function() {
			if (!this.isAuthorized()) {
				return false;
			}

			this.userInfo = new UserModel();
			this.userInfo.once("sync", function() {

				$("#user-info").html(
					_.template(userInfoTemplate)({
						user: this.userInfo.toJSON()
					})
				);
			}, this);

			this.fetchUserInfo();
		},

		fetchUserInfo: function() {
			this.userInfo.fetch({
				beforeSend: App.WPCOM.setBearer,
				error: $.proxy(this, 'onErrorFetchUserInfo')
			});
		},

		onErrorFetchUserInfo: function(xhr, status, err) {
			var msg = "Error fetching user info";
			if (status.responseJSON && status.responseJSON.message) {
				msg = status.responseJSON.message;
			}
			alert(msg);

			this.logout();
		},

		search: function(keyword, offset) {
			if (!this.isAuthorized()) {
				this.navigate("authorize", {trigger: true, replace: true});
				return false;
			}
			this.reset();

			offset = offset || 0;

			this.currentView = new SearchView({
				collection: this.giphyCollection,
				keyword: keyword,
				offset: offset,
				router: this
			});

			if (!_.isEmpty(keyword)) {
				this.currentView.search(keyword, offset);
			}

			this.$main.html(this.currentView.render().el);
		},

		// Show loading.
		showLoader: function() {
			if (!this.$main.find(".loader").length) {
				this.$main.html('<div class="loader">Loading...</div>');
			}
		},

		isAuthorized: function() {
			return ( App.WPCOM.auth.accessToken() && App.WPCOM.auth.siteID() );
		},

		reset: function() {
			this.showLoader();

			if (this.giphyCollection.length) {
				this.giphyCollection.reset();
			}

			if (!_.isNull(this.currentView)) {
				this.currentView.remove();
			}
		}
	});

	module.exports = Router;
});
