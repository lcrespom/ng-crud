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
	}]);

})();