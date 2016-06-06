/**
 * Created by mali on 2016/5/31.
 */
angular.module('app').controller('parkingCtl', function($scope) {
    $scope.parking = $scope.poi.parkings[0];
    $scope.parkingBuildingType = FM.dataApi.Constant.PARKING_TYPE;
    $scope.tollStd = FM.dataApi.Constant.TOLLSTD;
    $scope.tollWay = FM.dataApi.Constant.TOLLWAY;
    $scope.remark = FM.dataApi.Constant.remark_ml;
    $scope.tollStdChange = function(event,charging){
        if (event.target.value == "5") {
            if (event.target.checked) {
                for (var key in tollStd) {
                    if (key != "5") {
                        tollStd[key] = false;
                    }
                }
            }
        } else {
            if (event.target.checked) {
                tollStd["5"] = false;
            }
        }
    };
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
});