(function() {
	angular.module('books', [
		'ngRoute'
	])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'views/welcome.html',
			controller: 'CrudCtrl'
		})
		.when('/users', {
			templateUrl: 'views/users.html',
			controller: 'CrudCtrl'
		})
		.when('/combos', {
			templateUrl: 'views/combos.html',
			controller: 'CrudCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	}])
	.controller('CrudCtrl', ['$scope', '$http', '$route', function ($scope, $http, $route) {
		$scope.items = [{a: 1, b: 2}, {a: 3, b: 4}];
		console.log(location.hash);
	}]);
})();