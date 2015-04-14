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
		//TODO: move completeDefaults into $crud service, then inject it
		completeDefaults(collectionMetadata);
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
				},
				surname: {
					label: 'Last name'
				},
				email: {
					label: 'e-mail'
				}
			}
			// fieldOrder: 'defaults to Object.keys(fields)'
			//TODO tableActions: {}
			//TODO tableActionsPosition: left/right
		}
	}

	function completeDefaults(metadata) {
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
	}

	function ucFirst(str) {
	    return str.charAt(0).toUpperCase() + str.substr(1);
	}


})();