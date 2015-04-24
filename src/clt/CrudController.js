(function() {
	angular.module('crud')

	// The CrudCtrl is instantiated every time the route changes
	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		// Get collection name and store it in $scope._crud.collectionName
		var paths = $route.current.originalPath.split('/');
		$scope._crud.collectionName = $route.current.collection || paths[1];
		// Get the metadata for the current collection and store it in $scope._crud.collectionMeta
		$scope._crud.collectionMeta = $scope._crud.metaData[$scope._crud.collectionName];
		// Get the action from the route and store it in $scope._crud.action
		$scope._crud.action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', $scope._crud.collectionName, ' -  Action:', $scope._crud.action);
		// Process action
		switch ($scope._crud.action) {
			case 'create':
				$scope.item = {};
				break;
			case 'read':
				$http.get('/data/' + $scope._crud.collectionName)
				.success(function(data) {
					// Stores the item list from the DB into the items property in the parent scope
					$scope.$parent.items = data.items;
				});
				break;
			case 'update':
				// Stores the currently selected item into $scope.item
				$scope.item = $scope.$parent.items[$route.current.params.id];
				break;
			default:
				throw new Error('Invalid action: ' + $scope._crud.action);
		}

		// Creates or updates the item in scope
		// Invoked by the submit button of the New item / modify item form
		$scope.doSubmit = function() {
			var verb = $scope._crud.action == 'create' ? 'post' : 'put';
			httpAction(verb, $scope.item);
		};

		// Deletes the item in scope
		// Invoked by the confirmation button in the delete popup dialog
		$scope.doDelete = function(modalId) {
			$('#' + modalId).on('hidden.bs.modal', function() {
				console.log('Deleting ', $scope.toDelete);
				httpAction('delete', undefined, '/' + $scope.toDelete._id)
				.success(function() {
					$route.reload();
				});
			});
		};

		// Stores the item to be deleted
		// Invoked by the "delete" action button in the table
		$scope.prepareDelete = function(idx) {
			$scope.toDelete = $scope.$parent.items[idx];
		};


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

	}])


	;


})();