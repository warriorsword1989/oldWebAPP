/**
 * Created by mali on 2016/6/1.
 */
angular.module('app').controller('hotelCtl', function ($scope) {
    // $scope.hotel = $scope.poi.hotels[0];
    $scope.reting = FM.dataApi.Constant.RETING;

    $scope.changeLevel = function () {
        var rat = $scope.poi.hotels[0].rating;
        if (rat == 5 || rat == 15 || rat == 4 || rat == 14 || rat == 6) {
            $scope.rootCommonTemp.levelArr = ['A'];
            $scope.poi.level = 'A';
        } else {
            $scope.rootCommonTemp.levelArr = ['B1'];
            $scope.poi.level = 'B1';
        }
    };
});
