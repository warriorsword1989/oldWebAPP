angular.module('app').controller('chargingPoleCtl', function($scope) {
	$scope.charging = $scope.poi.chargingPole[0];
    $scope.chargeChainObj = {};
    for(var i=0;i<$scope.chargeChain.length;i++){
    	$scope.chargeChainObj[$scope.chargeChain[i].chainCode] = $scope.chargeChain[i];
    }
     
    $scope.chainChange = function(evt, obj){

        $scope.poi.kindCode = obj.selectedKind;
    
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
        } else if(event.target.value >= "99"){
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
            }
            else {
                $scope.charging.chargeChainObj = {};
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
});