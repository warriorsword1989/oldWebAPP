/**
 * Created by mali on 2016/6/1.
 */
angular.module('app').controller('hotelCtl', function($scope) {
    $scope.hotel = $scope.poi.hotels[0];
    $scope.reting = FM.dataApi.Constant.RETING;
});