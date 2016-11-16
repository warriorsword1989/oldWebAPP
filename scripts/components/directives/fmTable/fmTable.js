/**
 * Created by chenx on 2016/5/18.
 * 此指令
 *
 */
angular.module('fastmap.uikit').directive('fmTable', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: '../../scripts/components/directives/fmTable/fmTable.htm',
        scope: {
            fmList: '=',
            showToolbar: '@'
        },
        controller: function ($scope, $element) {
            $scope.columns = [];
            $scope.test = function () {
                console.log('test');
            };
            this.addColumn = function (fmColumn) {
                console.log('table func');
            };
        },
        controllerAs: 'tableCtl',
        link: function (scope, element, attrs) {
            console.log('test');
        }
    };
}).directive('fmTr', function () {
    return {
        restrict: 'EA',
        require: '^fmTable',
        transclude: true,
        replace: true,
        template: '<tr ng-transclude></tr>',
        controller: function ($scope, $element) {
            this.addTd = function (tdObj) {
                $scope.$parent.columns.push(tdObj);
            };
        },
        link: function (scope, element, attrs, tableCtl) {
            console.log('test tr link');
        }
    };
}).directive('fmTd', function () {
    return {
        restrict: 'EA',
        require: '^fmTr',
        transclude: true,
        replace: true,
        template: '<th ng-transclude></th>',
        controller: function ($scope, $element) {
            this.addTd = function () {
                console.log('td func');
            };
        },
        link: function (scope, element, attrs, trCtl, trans) {
            trCtl.addTd({
                field: attrs.field,
                title: element.text(),
                visible: true
            });
        }
    };
});
