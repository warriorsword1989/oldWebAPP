/**
 * Created by mali on 2016/6/6.
 */
angular.module('app').controller('restaurantCtl', function($scope) {
    // $scope.restaurant = $scope.poi.restaurants[0];
    $scope.creditCard = FM.dataApi.Constant.CREDIT_CARD;
    $scope.parkingOptions = [
        {"id": 0, "label": " 未调查"},
        {"id": 1, "label": " 无停车位"},
        {"id": 2, "label": " 收费停车"},
        {"id": 3, "label": " 免费停车"}
    ];
    $scope.creditCardChange = function(event){
        var obj = $scope.poi.restaurants[0].creditCard;
        var rejectVal = "0";
        FM.Util.setCheckboxMutex(event,obj,rejectVal);
    }
});