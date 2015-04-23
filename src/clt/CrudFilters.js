(function() {
	angular.module('crud')

	.filter('singular', ['crud', function(crud) {
		return crud.singularize;
	}])

})();