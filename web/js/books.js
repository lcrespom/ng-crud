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
			templateUrl: 'views/user-table.html',
			controller: 'CrudCtrl'
		})
		.when('/users/create', {
			templateUrl: 'views/user-form.html',
			controller: 'CrudCtrl'
		})
		.when('/users/update/:id', {
			templateUrl: 'views/user-form.html',
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

	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		var paths = $route.current.originalPath.split('/');
		var collection = $route.current.collection || paths[1];
		$scope.action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', collection, ' -  Action:', $scope.action);
		switch ($scope.action) {
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
				throw new Error('Invalid action: ' + $scope.action);
		}

		$scope.doSubmit = function() {
			var verb = $scope.action == 'create' ? 'post' : 'put';
			$http[verb]('/data/' + collection, $scope.item)
			.success(function(data) {
				console.log(verb.toUpperCase() + ' OK: ', data);
				$location.path(collection);
			})
			.error(function(data, status, headers, config) {
				//TODO report error to end user
				console.error(verb.toUpperCase() + ' Error: ', data, status, headers, config);
			});
		};

	}]);

})();