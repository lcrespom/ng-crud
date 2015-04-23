(function() {
	angular.module('crud')

	.provider('crud', function() {
		this.$get = function() {
			// Accessible via 'crud' injected parameter
			return {
				setMetaData: setMetaData,
				singularize: singularize
			}
		};

		// this.* is accessible via 'crudProvider' injected parameter
		this.routesForCollection = routesForCollection;
	})


	//------------------------- Privates -------------------------
	;

	function setMetaData($scope, collectionMetadata) {
		completeMetadataDefaults(collectionMetadata);
		$scope._crud = $scope._crud || {};
		$scope._crud.metaData = collectionMetadata;
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

	function ucFirst(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}

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