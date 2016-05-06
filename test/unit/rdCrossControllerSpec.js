/**
 * Created by xujie on 2016/5/4 0004.
 * 负责测试rdCrossController.js
 */

define(['mainApp','angularMocks'], function () {

    describe('rdCrossController', function () {

        beforeEach(angular.mock.module('mapApp'));

        var scope, rdCrossController;

        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            rdCrossController = $controller('rdCrossController', {$scope: scope});
        }));

        it('works for underscore', function () {

            //expect(scope.initializeRdCrossData).toEqual(true);
        });

    });

});
