angular.module('app').controller('chargingPoleCtl', function($scope) {
	$scope.chargingArr = $scope.poi.chargingPole;
    var chargeChainFmt = {};
    for(var i=0;i<$scope.chargeChain.length;i++){
    	chargeChainFmt[$scope.chargeChain[i].chainCode] = $scope.chargeChain[i];
    }
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    for(var i=0;i<$scope.chargingArr.length;i++){
    	if($scope.chargingArr[i].selectedChain || $scope.chargingArr[i].selectedChain<99){
    		$scope.chargingArr[i].chargeChainObj = {};
    	}else{
    		$scope.chargingArr[i].chargeChainObj = chargeChainFmt;
    	}
    }
    $scope.changeOpenType = function(event,charging) {
        if (event.target.value == "1") {
            if (event.target.checked) {
                for (var key in charging.openType) {
                    if (key != "1") {
                        charging.openType[key] = false;
                        charging.chargeChainObj = {};
                    }
                }
            }
        } else if(event.target.value >= 99){
            if (event.target.checked) {
                charging.openType["1"] = false;
                charging.chargeChainObj = chargeChainFmt;
            }
            else {
                charging.chargeChainObj = {};
            }
        } else {
            if (event.target.checked) {
                charging.openType["1"] = false;
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
    $scope.addChargPole = function(){
	    var chargingObj = {
	    	      "count" : 1,
	    	      "plugType" : null,
	    	      "productNum" : null,
	    	      "power" : null,
	    	      "floor" : null,
	    	      "factoryNum" : null,
	    	      "locationType" : 2,
	    	      "parkingNum" : null,
	    	      "acdc" : 0,
	    	      "mode" : 0,
	    	      "current" : "40",
	    	      "openType" : "1",
	    	      "plugNum" : 1,
	    	      "voltage" : "240",
	    	      "groupId" : 1,
	    	      "plotNum" : null,
	    	      "prices" : null,
	    	      "availableState" : 0,
	    	      "payment" : "4",
	    	      "manufacturer" : null
	    	    };
	    $scope.poi.chargingPole.push(new FM.dataApi.IxPoiChargingPole(chargingObj));
    };
    $scope.removeChargPole = function(index){
    	if ($scope.poi.chargingPole.length > 1) {
            $scope.poi.chargingPole.splice(index, 1);
        }
    };
});