(function() {

	angular.module('crud', ['ngRoute'])

	//------------------------- Controller -------------------------

	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		var paths = $route.current.originalPath.split('/');
		$scope.collection = $route.current.collection || paths[1];
		$scope.action = $route.current.action || paths[2] || 'read';
		console.log('Collection:', $scope.collection, ' -  Action:', $scope.action);
		switch ($scope.action) {
			case 'create':
				$scope.item = {};
				break;
			case 'read':
				$http.get('/data/' + $scope.collection)
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
			return $http[verb]('/data/' + $scope.collection + extraPath, item)
			.success(function(data) {
				console.log(verb.toUpperCase() + ' OK: ', data);
				$location.path($scope.collection);
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
	}])


	//------------------------- Directives -------------------------

	.directive('crudInput', function() {
		return {
			restrict: 'E',
			scope: {
				label: '@',
				placeholder: '@',
				model: '=',
				type: '@',
				id: '@',
				autofocus: '@'
			},
			link: function(scope, element, attrs) {
				// Set focus if autofocus attribute is present
				if (attrs.hasOwnProperty('autofocus'))
					element.find('input').focus();
				// Copy all extra attributes into the input element
				for (var prop in attrs)
					if (attrs.hasOwnProperty(prop) && prop[0]!='$' && !scope[prop])
						element.find('input').attr(prop, attrs[prop]);
			},
			template:
				'<div class="form-group">' +
					'<label for="{{id}}-input" class="col-sm-2 control-label">{{label}}</label>' +
					'<div class="col-sm-10">' +
						'<input ng-model="model" type="{{type}}" class="form-control" id="{{id}}-input" placeholder="{{placeholder}}">' +
					'</div>' +
				'</div>'
		};
	})

	.directive('crudFormButtons', function() {
		return {
			restrict: 'E',
			template:
				'<div class="form-group">' +
					'<div class="col-sm-12 text-center">' +
						'<button type="button" class="btn btn-primary" ng-click="doSubmit()">' +
							"{{ action == 'create' ? 'Create' : 'Update' }}" +
						'</button>' +
						'&nbsp;' +
						'<a href="#/{{collection}}" class="btn btn-default">Cancel</a>' +
					'</div>' +
				'</div>'
		};
	})

	.directive('crudTable', function() {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
				scope.collInfo = scope.crud[scope.collection];
			},
			templateUrl: 'templates/crud-table.html'
		};
	})


	//------------------------- Filters -------------------------

	.filter('singular', function() {
		return singularize;
	})


	//------------------------- Services -------------------------

	.factory('crudHelper', [function() {
		return {
			completeMetadataDefaults: completeMetadataDefaults
		}

		function completeMetadataDefaults(metadata) {
			for (var collName in metadata)
				if (metadata.hasOwnProperty(collName)) {
					var collMeta = metadata[collName];
					if (!collMeta.fieldOrder)
						collMeta.fieldOrder = Object.keys(collMeta.fields);
					for (var i = 0; i < collMeta.fieldOrder.length; i++) {
						completeFieldDefaults(collMeta.fields, collMeta.fieldOrder[i]);
					}
				}
		}

		function completeFieldDefaults(fields, name) {
			var field = fields[name];
			if (field.label === undefined) field.label = ucFirst(name);
			if (field.colLabel === undefined) field.colLabel = field.label;
			if (!field.cellRender) field.cellRender = identity;
		}

		function identity(x) { return x }

		function ucFirst(str) {
		    return str.charAt(0).toUpperCase() + str.substr(1);
		}
	}])


	//------------------------- Privates -------------------------
	;

	function singularize(plural) {
		plural = plural.toLowerCase();
		if (plural[plural.length - 1] == 's')
			return plural.substr(0, plural.length - 1);
		// TODO: complete with most common irregular plurals
		var irregulars = {
			mice: 'mouse', teeth: 'tooth'
		}
		var singular = irregulars[plural];
		if (!singular)
			console.warn('Warning: singular of "', plural, '" not found');
		return singular ? singular : plural;
	}

})();