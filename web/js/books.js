(function() {

	angular.module('books', [
		'ngRoute', 'ngSanitize', 'crud'
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

	.controller('appCtrl', ['$scope', 'crudHelper', function($scope, crudHelper) {
		crudHelper.completeMetadataDefaults(collectionMetadata);
		$scope.crud = collectionMetadata;
	}])

	;

	//------------------------- Collection metadata -------------------------

	var collectionMetadata = {
		users: {
			// itemName: 'name of an item, defaults to singular of collection from location'
			// tableName: 'name of table, defaults to collection from location'
			fields: {
				// Only specified fields will be displayed.
				// To use all defaults for a field, associate it with {}
				name: {
					// label: 'Defaults to property name with ucFirst'
					label: 'First name',
					// placeholder: 'defaults to no placeholder displayed'
					// colLabel: 'deafults to label'
					// cellStyle: 'a CSS object as expected by ng-style'
					// cellRender: 'a function that will render cell content - default to identity'
				},
				surname: {
					label: 'Last name'
				},
				email: {
					label: 'e-mail',
					cellRender: function(email) {
						if (!email) return '';
						return '<a href="mailto:' + email + '" target="_blank">' + email + '</a>';
					}
				}
			}
			// fieldOrder: 'defaults to Object.keys(fields)'
			//TODO tableActions: {}
			//TODO tableActionsPosition: left/right
		}
	}

})();