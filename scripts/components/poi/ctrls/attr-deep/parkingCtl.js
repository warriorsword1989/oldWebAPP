/**
 * Created by mali on 2016/5/31.
 */
angular.module('app').controller('parkingCtl', function($scope) {
    $scope.parkingBuildingType = FM.dataApi.Constant.PARKING_TYPE;
    $scope.tollStd = FM.dataApi.Constant.TOLLSTD;
    $scope.tollWay = FM.dataApi.Constant.TOLLWAY;
    $scope.remark = FM.dataApi.Constant.remark_ml;
    /*支付方式*/
    $scope.paymentObj = FM.dataApi.Constant.PAYMENT;
    $scope.tollStdChange = function(event){
        var obj = $scope.poi.parkings[0].tollStd;
        var rejectVal = "5";
        Utils.setCheckboxMutex(event,obj,rejectVal);
    };
    $scope.remarkChange = function(event){
        var obj = $scope.poi.parkings[0].remark;
        var rejectVal = "0";
        if (event.target.value == "0") {
            if (event.target.checked) {
                for (var key in obj) {
                    if (key != "0" && key != "7") {
                        obj[key] = false;
                    }
                }
            }
        } else {
            if (event.target.checked && event.target.value != "7") {
                obj["0"] = false;
            }
        }
//        Utils.setCheckboxMutex(event,obj,rejectVal);
    }
    $scope.test = function(event,obj,rejectVal1,rejectVal2){
        for(var i=0;i<rejectVal1.length;i++){
            if(event.target.value == rejectVal1[i]){
                if(event.target.checked){
                    for(var j=0;j<rejectVal2.length;j++){
                        obj[rejectVal2[j]] = false;
                    }
                }
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