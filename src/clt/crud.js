(function() {
	angular.module('crud', ['ngRoute'])

	//------------------------- Controller -------------------------

	.controller('CrudCtrl', ['$scope', '$http', '$route', '$location',
		function($scope, $http, $route, $location) {
		var paths = $route.current.originalPath.split('/');
		$scope.collection = $route.current.collection || paths[1];
		$scope.collInfo = $scope.crudMetadata[$scope.collection];
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
			scope: formInputScope,
			link: formInputLink,
			template: formInputHeader +
				'<input ng-model="model" class="form-control" id="{{id}}_input" placeholder="{{placeholder}}">' +
				formInputFooter
		};
	})

	.directive('crudTextArea', function() {
		return {
			restrict: 'E',
			scope: formInputScope,
			link: formInputLink,
			template: formInputHeader +
				'<textarea ng-model="model" class="form-control" id="{{id}}_textarea" placeholder="{{placeholder}}">' +
				'</textarea>' +
				formInputFooter
			};
	})

	.directive('crudSelect', function() {
		return {
			restrict: 'E',
			scope: formInputScope,
			link: function(scope, element, attrs) {
				formInputLink(scope, element, attrs);
				var fieldMeta = scope.$parent.$eval('collInfo.fields[field]');
				scope[attrs.id + '_listModel'] = fieldMeta.listModel;
			},
			template: formInputHeader +
				'<select ng-model="model" class="form-control" id="{{id}}_select"' +
					'ng-options="option.label for option in {{id}}_listModel">' +
				'</select>' +
				formInputFooter
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
			templateUrl: 'templates/crud-table.html'
		};
	})

	// Super generic form input that compiles into the specific input as specified in field metadata
	.directive('crudFormInput', ['$compile', function($compile) {
		return {
			restrict: 'E',
			link: function(scope, element, attrs) {
				var fieldMeta = scope.$eval('collInfo.fields[field]');
				var tag = fieldMeta.inputType;
				var html = '<' + tag + ' id="crud_{{field}}" ' +
					'label="{{collInfo.fields[field].label}}" ' +
					'placeholder="{{collInfo.fields[field].placeholder}}" model="item[field]" ' +
					'autofocus="{{ $first ? \'true\' : \'false\' }}"';
				var inputAttrs = fieldMeta.inputAttrs;
				for (var prop in inputAttrs)
					if (inputAttrs.hasOwnProperty(prop))
						html += ' ' + prop + '="' + inputAttrs[prop] + '"';
				html += '></' + tag + '>';
				element.append($compile(html)(scope));
			}
		}
	}])


	//------------------------- Filters -------------------------

	.filter('singular', function() {
		return singularize;
	})


	//------------------------- Services -------------------------

	.provider('crud', function() {
		this.$get = function() {
			// Accessible via 'crud' injected parameter
			return {
				completeMetadataDefaults: completeMetadataDefaults
			}
		};

		// this.* is accessible via 'crudProvider' injected parameter
		this.routesForCollection = routesForCollection;
	})


	//------------------------- Privates -------------------------
	;

	var formInputScope = {
		label: '@',
		placeholder: '@',
		model: '=',
		id: '@',
		autofocus: '@'
	};

	var formInputLink = function(scope, element, attrs) {
		// Warning: this line requires jQuery, otherwise a manual search would be required
		var inputElement = element.find('.form-control');
		// Set focus if autofocus attribute is present
		if (attrs.hasOwnProperty('autofocus') && attrs.autofocus != 'false') {
			// setTimeout without time parameter defers to after DOM rendering
			setTimeout(function() { inputElement.focus(); });
		}
		// Copy all extra attributes into the input element
		for (var prop in attrs)
			if (attrs.hasOwnProperty(prop) && prop[0]!='$' && !scope[prop])
				inputElement.attr(prop, attrs[prop]);
	};

	var formInputHeader =
		'<div class="form-group">' +
			'<label for="{{id}}-input" class="col-sm-3 control-label">{{label}}</label>' +
				'<div class="col-sm-9">';

	var formInputFooter = '</div></div>';


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

	function ucFirst(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}

	function completeMetadataDefaults(metadata) {
		for (var collName in metadata)
			if (metadata.hasOwnProperty(collName)) {
				// Collection defaults
				var collMeta = metadata[collName];
				collMeta.collection = collName;
				if (!collMeta.tableName) collMeta.tableName = ucFirst(collName);
				if (!collMeta.itemName) collMeta.itemName = singularize(collName);
				if (!collMeta.fieldOrder)
					collMeta.fieldOrder = Object.keys(collMeta.fields);
				// Field defaults
				for (var i = 0; i < collMeta.fieldOrder.length; i++) {
					completeFieldDefaults(collMeta.fields, collMeta.fieldOrder[i]);
				}
			}
	}

	function completeFieldDefaults(fields, name) {
		var field = fields[name];
		// Form defaults
		if (field.label === undefined) field.label = ucFirst(name);
		if (!field.inputType) field.inputType = 'crud-input';
		if (!field.inputAttrs) field.inputAttrs = {};
		// Table defaults
		if (field.colLabel === undefined) field.colLabel = field.label;
		if (!field.cellRender) field.cellRender = identity;
		if (field.showInTable === undefined) field.showInTable = true;
	}

	function identity(x) { return x }

	function routesForCollection($routeProvider, collection, ctrl) {
		ctrl = ctrl || 'CrudCtrl';
		$routeProvider.when('/' + collection, {
			templateUrl: 'templates/crud-table-view.html',
			controller: ctrl
		})
		.when('/' + collection + '/create', {
			templateUrl: 'templates/crud-form-view.html',
			controller: ctrl
		})
		.when('/' + collection + '/update/:id', {
			templateUrl: 'templates/crud-form-view.html',
			controller: ctrl
		})
	}

})();