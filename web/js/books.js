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
		})
		.when('/users/update/:id', {
			templateUrl: 'views/users-update.html',
			controller: 'CrudCtrl',
		})
		.when('/combos', {
			templateUrl: 'views/combos.html',
			controller: 'CrudCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	}])

	.controller('CrudCtrl', ['$scope', '$rootScope', '$http', '$route', function($scope, $rootScope, $http, $route) {
		var paths = $route.current.originalPath.split('/');
		var collection = $route.current.collection || paths[1];
		var action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', collection, ' -  Action:', action);
		switch (action) {
			case 'create':
				break;
			case 'read':
				$http.get('/data/' + collection).success(function(data) {
					$rootScope.items = data.items;
				});
				break;
			case 'update':
				$scope.item = $rootScope.items[$route.current.params.id];
				break;
			case 'delete':
				break;
			default:
				throw new Error('Invalid action: ' + action);
		}
	}]);

})();