/**
 * Created by mali on 2016/6/1.
 */
angular.module('app').controller('OilStationCtl', function($scope) {
    // $scope.gasstation = $scope.poi.gasstations[0];
    $scope.paymentML = FM.dataApi.Constant.payment_ml;
    $scope.paymentHM = FM.dataApi.Constant.payment_hm;
    $scope.serviceML = FM.dataApi.Constant.service_ml;
    $scope.serviceHM = FM.dataApi.Constant.service_hm;
    $scope.oilType = FM.dataApi.Constant.oilType;
    $scope.mgType = FM.dataApi.Constant.mgType;
    $scope.egType = FM.dataApi.Constant.egType;
    $scope.fuelTypeML = FM.dataApi.Constant.fuelType_ml;
    $scope.fuelTypeHM = FM.dataApi.Constant.fuelType_hm;

});