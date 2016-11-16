angular.module('app').controller('chargingPlotCtrl', function ($scope) {
    var chargeChainFmt = {};
    $scope.chainListPlot = {};
    $scope.chargingArr = $scope.poi.chargingplots;

    /* 初始化品牌*/
    $scope.initChain = function () {
        var allChain = $scope.metaData.allChain;
        for (var i in allChain) {
            if (i === '230218' || i === '230227'){
                for (var j = 0; j < allChain[i].length; j++) {
                    var cha = allChain[i][j];
                    if (cha.chainCode && cha.chainCode !== '0') {
                        $scope.chainListPlot[cha.chainCode] = { // 转换成chosen-select可以解析的格式
                            category: cha.category,
                            chainCode: cha.chainCode,
                            weight: cha.weight,
                            chainName: cha.chainName
                        };
                    }
                }
            }
        }
    };
    $scope.initChain();

    $scope.chargingPlugTypeChange = function (event, charging) {
        var obj = charging.plugType;
        Utils.setCheckBoxSingleCheck(event, obj);
    };
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    for (var i = 0; i < $scope.chargingArr.length; i++) {
        if ($scope.chargingArr[i].selectedChain || $scope.chargingArr[i].selectedChain < 99) {
            $scope.chargingArr[i].chargeChainObj = {};
        } else {
            $scope.chargingArr[i].chargeChainObj = chargeChainFmt;
        }
    }
    $scope.changeOpenType = function (event, charging) {
        if (event.target.value == '1') {
            if (event.target.checked) {
                for (var key in charging.openType) {
                    if (key != '1') {
                        charging.openType[key] = false;
                        charging.chargeChainObj = {};
                    }
                }
                charging.isBrandOpen = false;
            }
        } else if (event.target.value >= 99) {
            if (event.target.checked) {
                charging.openType['1'] = false;
                charging.chargeChainObj = chargeChainFmt;
            } else {
                charging.chargeChainObj = {};
            }
        } else if (event.target.checked) {
            charging.openType['1'] = false;
        }
    };
    $scope.changeBrandOpen = function (event, charging) {
        if (event.target.checked) {
            charging.openType['1'] = false;
        }
    };
    $scope.chargingPlugType = FM.dataApi.Constant.plugType;
    $scope.chargingOpenType = FM.dataApi.Constant.openType;
    $scope.charginPayment = FM.dataApi.Constant.plotPayment;
    $scope.chargingAvailableState = [   // 充电站类型
        { id: 0, label: '可以使用（有电）' },
        { id: 1, label: '不可使用（没电）' },
        { id: 2, label: '维修中' },
        { id: 3, label: '建设中' },
        { id: 4, label: '规划中' }
    ];
    $scope.addChargPole = function () {
        $scope.poi.chargingplots.unshift(new FM.dataApi.IxPoiChargingplot({}));
    };
    $scope.removeChargPole = function (index) {
        if ($scope.poi.chargingplots.length > 1) {
            $scope.poi.chargingplots.splice(index, 1);
        }
    };
    // if ($scope.chargingArr.length === 0) {
    //     $scope.addChargPole();
    // }
});
