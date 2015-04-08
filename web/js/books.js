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
			controller: 'CrudCtrl',
			collection: 'users'
		})
		.when('/combos', {
			templateUrl: 'views/combos.html',
			controller: 'CrudCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	}])
	.controller('CrudCtrl', ['$scope', '$http', '$route', function($scope, $http, $route) {
		var collection = $route.current.collection || $route.current.originalPath.substr(1);
		$http.get('/data/' + collection).success(function(data) {
			$scope.items = data.items;
		});
	}]);
})();