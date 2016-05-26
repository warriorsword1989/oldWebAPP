angular.module('app').controller('chargingPoleCtl', function($scope) {
	$scope.charging = $scope.poi.chargingPole[0];
    var chargeChainFmt = {};
    for(var i=0;i<$scope.chargeChain.length;i++){
    	chargeChainFmt[$scope.chargeChain[i].chainCode] = $scope.chargeChain[i];
    }
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    if(!$scope.charging.selectedChain || $scope.charging.selectedChain < 99){
    	$scope.chargeChainObj = {};
    }else{
    	$scope.chargeChainObj = chargeChainFmt;
    }
    $scope.changeOpenType = function(event) {
        if (event.target.value == "1") {
            if (event.target.checked) {
                for (var key in $scope.charging.openType) {
                    if (key != "1") {
                        $scope.charging.openType[key] = false;
                        $scope.chargeChainObj = {};
                    }
                }
            }
        } else if(event.target.value >= 99){
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
                $scope.chargeChainObj = chargeChainFmt;
            }
            else {
                $scope.chargeChainObj = {};
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