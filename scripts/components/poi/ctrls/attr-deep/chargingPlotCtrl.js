angular.module('app').controller('chargingPlotCtrl', function($scope) {
    $scope.chargingArr = $scope.poi.chargingPlot;

    var chargeChainFmt = {};
    /*初始化品牌*/
    $scope.initChain = function() {
        var chainArray = [];
        chainArray.unshift({
            "chainCode": "0",
            "chainName": "--无法获取--"
        });
        $scope.chargeChain = {};
        for (var i = 0, len = chainArray.length; i < len; i++) {
            var cha = chainArray[i];
            $scope.chargeChain[cha.chainCode] = { //转换成chosen-select可以解析的格式
                "category": cha.category,
                "chainCode": cha.chainCode,
                "weight": cha.weight,
                "chainName": cha.chainName
            }
        }
    };
    $scope.initChain();
    // for(var i=0;i<$scope.chargeChain.length;i++){
    //     chargeChainFmt[$scope.chargeChain[i].chainCode] = $scope.chargeChain[i];
    // }
    $scope.chargingPlugTypeChange = function(event){
        var obj = $scope.poi.chargingPlot[0].plugType;
        Utils.setCheckBoxSingleCheck(event,obj);
    };
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
    $scope.chargingPlugType = FM.dataApi.Constant.plugType;
    $scope.chargingOpenType = FM.dataApi.Constant.openType;
    // $scope.chargingAvailableState = FM.dataApi.Constant.chargingAvailableState;
    $scope.chargingAvailableState = [   //充电站类型
        {"id": 0, "label": "可以使用（有电）"},
        {"id": 1, "label": "不可使用（没电）"},
        {"id": 2, "label": "维修中"},
        {"id": 3, "label": "建设中"},
        {"id": 4, "label": "规划中"}
    ];
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
        $scope.poi.chargingPlot.push(new FM.dataApi.IxPoiChargingplot(chargingObj));
    };
    $scope.removeChargPole = function(index){
        if ($scope.poi.chargingPlot.length > 1) {
            $scope.poi.chargingPlot.splice(index, 1);
        }
    };
    if($scope.chargingArr.length == 0){
        $scope.addChargPole();
    }
});