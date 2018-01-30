angular.module('jkuri.autocomplete', [])

.factory('ngAutocompleteService', ['$http', function($http) {
	var self = this;

	self.getData = function (url, keyword, token) {
		return $http.get(url, { query: keyword, headers: {'Xtoken': token} });
	};

	return self;
}])

.directive('ngAutocomplete', ['$timeout', '$filter', 'ngAutocompleteService', function($timeout, $filter, ngAutocompleteService) {
	'use strict';

	var keys = {
		left	: 37,
		up		: 38,
		right	: 39,
		down	: 40,
		enter	: 13,
		esc		: 27
	};

	var setScopeValues = function (scope, attrs) {
		scope.url = attrs.url || null;
		scope.searchProperty = attrs.searchProperty || 'title';
		scope.maxResults = attrs.maxResults || 10;
		scope.delay = parseInt(attrs.delay, 10) || 300;
		scope.minLenth = parseInt(attrs.minLenth, 10) || 2;
		scope.allowOnlyResults = scope.$eval(attrs.allowOnlyResults) || false;
		scope.placeholder = attrs.placeholder || 'Search ...';
		scope.theme = attrs.theme || '';
	};

	var delay = (function() {
		var timer = 0;
		return function (callback, ms) {
			$timeout.cancel(timer);
			timer = $timeout(callback, ms);
		};
	})();

	return {
		restrict: 'E',
		require: '?ngModel',
		scope: true,
		link: function(scope, element, attrs, ngModel) {
			setScopeValues(scope, attrs);

			scope.results = [];
			scope.currentIndex = null;

			scope.getResults = function () {
				if (parseInt(scope.keyword.length, 10) === 0) scope.results = [];
				if (scope.keyword.length < scope.minLenth) return;

				delay(function() {

					ngAutocompleteService.getData(scope.url, scope.keyword, scope.get_auth_token).then(function(resp) {
						scope.results = [];
						var filtered = $filter('filter')(resp.data, {name: scope.keyword});
						for (var i = 0; i < scope.maxResults; i++) {
							 
							scope.results.push(filtered[i]);
						}
						scope.currentIndex = 0;

						if (scope.results.length) {
							scope.showResults = true;
						}
					});
				}, scope.delay);
			};

			scope.selectResult = function (r) {

				scope.keyword = r.title;
				ngModel.$setViewValue(r.title);
				scope.showResults = false;
			};

			scope.clearResults = function () {
				scope.results = [];
				scope.currentIndex = null;
			};

			scope.hoverResult = function (i) {
				scope.currentIndex = i;
			}

			scope.blurHandler = function () {
				$timeout(function() {
					if (scope.allowOnlyResults) {
						var find = $filter('filter')(scope.results, {title: scope.keyword}, true);
						if (!find.length) {
							scope.keyword = '';
							ngModel.$setViewValue('');
						}
					}
					scope.showResults = false;
				}, 100);
			};

			scope.keyupHandler = function (e) {
				var key = e.which || e.keyCode;

				if (key === keys.enter) {
					scope.selectResult(scope.results[scope.currentIndex]);
				}

				if (key === keys.left || key === keys.up) {
					if (scope.currentIndex > 0) {
						scope.currentIndex -= 1;
					}
				}

				if (key === keys.right || key === keys.down) {
					if (scope.currentIndex < scope.maxResults - 1) {
						scope.currentIndex += 1;
					}
				}

				if (key === keys.esc) {
					scope.keyword = '';
					ngModel.$setViewValue('');
					scope.clearResults();
				}

			};

		},
		template:
		'<input type="text" ng-model="keyword" class="ng-autocomplete-input" placeholder="{{ placeholder }}" ng-change="getResults()" ng-keyup="keyupHandler($event)" ng-blur="blurHandler()" ng-focus="currentIndex = 0" autocorrect="off" autocomplete="off">' +
		'<div class="ng-autocomplete-holder" ng-show="showResults" ng-class="{\'red\': theme === \'red\', \'green\': theme === \'green\', \'blue\': theme === \'blue\'}">' +
		'  <div class="ng-autocomplete-result" ng-repeat="r in results | filter : {name: keyword}" ng-click="showCategoryPost({{ r.id }})" ng-mouseover="hoverResult($index)" ng-class="{\'hover\': $index === currentIndex}">' +
		'    <span class="ng-autocomplete-result-name"><img src="{{base_url}}/{{ r.image }}" width="25px"  /> {{ r.name }}</span>' +
		'  </div>' +
		'</div>'
	};

}]);