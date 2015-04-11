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
			default:
				throw new Error('Invalid action: ' + $scope.action);
		}

		function httpAction(verb, item, extraPath) {
			extraPath = extraPath || '';
			return $http[verb]('/data/' + collection + extraPath, item)
			.success(function(data) {
				console.log(verb.toUpperCase() + ' OK: ', data);
				$location.path(collection);
			})
			.error(function(data, status, headers, config) {
				//TODO report error to end user
				console.error(verb.toUpperCase() + ' Error: ', data, status, headers, config);
			});
		}

		$scope.doSubmit = function() {
			var verb = $scope.action == 'create' ? 'post' : 'put';
			httpAction(verb, $scope.item);
		};

		$scope.doDelete = function(modalId) {
			$('#' + modalId).on('hidden.bs.modal', function() {
				console.log('Deleting ', $scope.toDelete);
				httpAction('delete', undefined, '/' + $scope.toDelete._id)
				.success(function() {
					$route.reload();
				});
			});
		};

		$scope.prepareDelete = function(idx) {
			$scope.toDelete = $scope.$parent.items[idx];
		};

	}]);

})();