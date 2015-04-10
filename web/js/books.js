(function() {

	angular.module('books', [
		'ngRoute'
	])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'views/welcome.html'
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

	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		var paths = $route.current.originalPath.split('/');
		var collection = $route.current.collection || paths[1];
		var action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', collection, ' -  Action:', action);
		switch (action) {
			case 'create':
				$scope.item = {};
				break;
			case 'read':
				$http.get('/data/' + collection)
				.success(function(data) {
					$scope.$parent.items = data.items;
				});
				break;
			case 'update':
				$scope.item = $scope.$parent.items[$route.current.params.id];
				break;
			case 'delete':
				break;
			default:
				throw new Error('Invalid action: ' + action);
		}

		$scope.doUpdate = function() {
			$http.put('/data/' + collection, $scope.item)
			.success(function(data) {
				console.log('PUT OK: ', data);
				$location.path(collection);
			})
			.error(function(data, status, headers, config) {
				//TODO report error to end user
				console.error('PUT Error: ', data, status, headers, config);
			});
		};

	}]);

})();