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
    };
    $scope.foodType1Change = function(event){
        var obj = $scope.poi.restaurants[0].foodType1;
        FM.Util.setCheckBoxSingleCheck(event,obj);
        //单独处理不能同时存在的几个风味
        var rejectArr = ["2016", "1001", "3009", "3015"];
        var obj2 = $scope.poi.restaurants[0].foodType2;
        for(var i = 0;i<rejectArr.length;i++){
            if(event.target.value == rejectArr[i]){
                for(var key in obj2){
                    obj2[key] = false;
                }
                break;
            }
        }
    };
    $scope.foodType2Change = function(event){
        var obj = $scope.poi.restaurants[0].foodType2;
        FM.Util.setCheckBoxSingleCheck(event,obj);
        //单独处理不能同时存在的几个风味
        var rejectArr = ["2016", "1001", "3009", "3015"];
        var obj1 = $scope.poi.restaurants[0].foodType1;
        for(var key in obj1){
            for(var i = 0;i<rejectArr.length;i++){
                if(key == rejectArr[i]){
                    obj1[key] = false;
                }
            }
        }
    }
});