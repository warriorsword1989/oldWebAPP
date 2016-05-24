angular.module('app').controller('chargingPoleCtl', function($scope) {
    var chargeChain = {
        data:[]
    };
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    $scope.changeOpenType = function(event) {
        if (event.target.value == "1") {
            if (event.target.checked) {
                for (var key in $scope.charging.openType) {
                    if (key != "1") {
                        $scope.charging.openType[key] = false;
                    }
                }
            }
        } else if(event.target.value == "99"){
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
                $scope.charging.chain = chargeChain;
            }
            else {
                $scope.charging.chain = {};
            }
        } else {
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
            }
        }
    };
    $scope.chargingPlugType = FM.dataApi.Constant.CHARGINGPOLE_PLUGTYPE;
    $scope.chargingOpenType = FM.dataApi.Constant.CHARGINGPOLE_OPENTYPE;
    $scope.chargingPayment = FM.dataApi.Constant.CHARGINGPOLE_PAYMENT;
    $scope.locationtype = FM.dataApi.Constant.CHARGINGPOLE_LOCATIONTYPE;
    $scope.chargingAcdc = FM.dataApi.Constant.CHARGINGPOLE_ACDC;
    $scope.chargingMode = FM.dataApi.Constant.CHARGINGPOLE_MODE;
    $scope.chargingAvailableState = FM.dataApi.Constant.CHARGINGPOLE_AVAILABLESTATE;
    $scope.charging = $scope.poi.chargingPole[0];
    //查询充电桩品牌列表
    $scope.$on("loaded",function (event, data) {
        FM.dataApi.ajax.get("charge/row_edit/queryChain/", {
            kindCode: data.kindCode
        }, function(data) {
            if (data.errcode == 0) {
                for(var i = 0;i<data.data.length;i++){
                    chargeChain.data.push({
                        id:data.data[i].chainCode,
                        text:data.data[i].chainName
                    });
                }
            } else {
                chargeChain = {};
            }
            console.log(chargeChain);
        });
    });
});