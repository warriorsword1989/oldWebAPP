/**
 * Created by mali on 2016/6/12.
 */
angular.module('app').controller('GasStationCtl', function ($scope) {
    // $scope.gasstation = $scope.poi.gasstations[0];
    $scope.paymentML = FM.dataApi.Constant.payment_ml;
    $scope.paymentHM = FM.dataApi.Constant.payment_hm;
    $scope.serviceML = FM.dataApi.Constant.service_ml;
    $scope.serviceHM = FM.dataApi.Constant.service_hm;
    $scope.fuelTypeML = FM.dataApi.Constant.gasFuelType_ml;
    $scope.fuelTypeHM = FM.dataApi.Constant.gasFuelType_hm;
});
