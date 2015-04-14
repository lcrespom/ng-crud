(function() {

	angular.module('books', [
		'ngRoute', 'crud'
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

	.controller('appCtrl', ['$scope', function($scope) {
		$scope.crud = collectionMetadata;
	}])

	;

	//------------------------- Collection metadata -------------------------

	var collectionMetadata = {
		users: {
			// itemName: 'name of an item, defaults to singular of collection from location'
			// tableName: 'name of table, defaults to collection from location'
			fields: {
				name: {
					// label: 'Defaults to property name with ucFirst'
					// placeholder: 'defaults to no placeholder displayed'
					// colLabel: 'deafults to label'
					// colWidth: 'in css units'
				},
				surname: 0,	// Only specified fields will be displayed
				email: {
					label: 'e-mail'
				}
			}
			// fieldOrder: 'defaults to Object.keys(fields)'
			// tableActions: {}
			// tableActionsPosition: left/right
		}
	}

})();