(function() {
	angular.module('crud')

	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		var paths = $route.current.originalPath.split('/');
		// Get collection name and store it in scope._crud.collectionName
		$scope._crud.collectionName = $route.current.collection || paths[1];
		$scope.collInfo = $scope._crud.metaData[$scope._crud.collectionName];
		$scope._crud.action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', $scope._crud.collectionName, ' -  Action:', $scope._crud.action);
		switch ($scope._crud.action) {
			case 'create':
				$scope.item = {};
				break;
			case 'read':
				$http.get('/data/' + $scope._crud.collectionName)
				.success(function(data) {
					$scope.$parent.items = data.items;
				});
				break;
			case 'update':
				$scope.item = $scope.$parent.items[$route.current.params.id];
				break;
			default:
				throw new Error('Invalid action: ' + $scope._crud.action);
		}

		function httpAction(verb, item, extraPath) {
			extraPath = extraPath || '';
			return $http[verb]('/data/' + $scope._crud.collectionName + extraPath, item)
			.success(function(data) {
				console.log(verb.toUpperCase() + ' OK: ', data);
				$location.path($scope._crud.collectionName);
			})
			.error(function(data, status, headers, config) {
				//TODO report error to end user
				console.error(verb.toUpperCase() + ' Error: ', data, status, headers, config);
			});
		}

		$scope.doSubmit = function() {
			var verb = $scope._crud.action == 'create' ? 'post' : 'put';
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

	}])


})();