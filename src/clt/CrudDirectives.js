(function() {
	angular.module('crud')

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

})();