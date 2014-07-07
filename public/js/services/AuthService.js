angular.module('AuthService', [])

	.factory('Auth', function($q, $rootScope) {

		// create the url
		var googleConfig = {
			response_type : 'token',
			client_id     : '300250807171-p7reqabt7jnt4ltjgo0t9rt6ulegss97.apps.googleusercontent.com',
			redirect_uri  : 'http://localhost:1337/auth/google/callback',
			scope         : 'https://www.googleapis.com/auth/analytics.readonly profile email'
		};		
		var url = createURL('https://accounts.google.com/o/oauth2/auth', googleConfig);


		// returns =============================================================
		return {

			/**
			 * Get the Token from Local Storage or a Cookie
			 */
			getToken: function() {

			},

			/**
			 * Get the Token from Local Storage or a Cookie
			 */
			setToken: function() {

			},

			/**
			 * Get the Token from Local Storage or a Cookie
			 */
			authenticate: function() {

				var deferred = $q.defer();

				// create the popup
				var popupWidth  = screen.width / 2;
				var popupHeight = screen.height - 200;
				var popupLeft   = (screen.width / 2) - (popupWidth / 2);
				var popupTop    = (screen.height / 2) - (popupHeight / 2);

				var win  = window.open(url, "Authentication", 'width=' + popupWidth + ', height=' + popupHeight + ', top=' + popupTop + ', left=' + popupLeft);

				// wait for information from the popup window and process on change
				angular.element(window).bind('message', function(event) {

					$rootScope.$apply(function() {
						if (event.originalEvent.data.access_token)
							deferred.resolve(event.originalEvent.data);
						else
							deferred.reject(event.originalEvent.data);		
					});

				});

				return deferred.promise;

			},

			/**
			 * Get the Token from Local Storage or a Cookie
			 */
			validateToken: function(token) {
				var validationConfig = {
					access_token: token
				};
				var url = createURL('https://www.googleapis.com/oauth2/v1/tokeninfo', validationConfig);

				return $http.get(url);
			}

		}

		// functions ===========================================================
		/**
		 * Create the Authentication URL From base URL and Object
		 */
		function createURL(base, object) {
			// generate url
			var url = [];

			// add each part to the object
			angular.forEach(object, function(value, key) {
				url.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			});

			// join by & and return
			return base + '?' + url.join('&');
		}

	})

	.controller('callbackController', function($location) {

		function parseKeyValue(/**string*/keyValue) {
			var obj = {}, key_value, key;
			angular.forEach((keyValue || "").split('&'), function(keyValue) {
				if (keyValue) {
					key_value = keyValue.split('=');
					key = decodeURIComponent(key_value[0]);
					obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
				}
			});
			
			return obj;
		}

		var queryString = $location.path().substring(1);	// preceding slash omitted
		var params      = parseKeyValue(queryString);

		// TODO: The target origin should be set to an explicit origin.	Otherwise, a malicious site that can receive
		// the token if it manages to change the location of the parent. (See:
		// https://developer.mozilla.org/en/docs/DOM/window.postMessage#Security_concerns)

		window.opener.postMessage(params, "*");
		window.close();

	});