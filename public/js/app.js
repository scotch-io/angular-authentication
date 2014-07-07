angular.module('authApp', ['AuthService'])

.controller('mainController', function($scope, Auth) {

	$scope.authenticate = function() {
		Auth.authenticate()
			.success(function(data) {
				
			})
			.error(function(data) {
				
			});
	};

});