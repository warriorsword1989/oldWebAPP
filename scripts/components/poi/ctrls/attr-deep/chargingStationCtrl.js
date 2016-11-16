angular.module('app').controller('chargingStationCtrl', function ($scope) {
    // $scope.chargingType = FM.dataApi.Constant.chargingType;
    $scope.chargingTypeArr = [   // 充电站类型
    { id: 1, label: '充电站' },
    { id: 2, label: '充换电站' },
    { id: 3, label: '充电桩组' },
    { id: 4, label: '换电站' }
    ];
    $scope.serviceProvArr = [
        { id: '0', label: '其他' },
        { id: '1', label: '国家电网' },
        { id: '2', label: '南方电网' },
        { id: '3', label: '中石油' },
        { id: '4', label: '中石化' },
        { id: '5', label: '中海油' },
        { id: '6', label: '中国普天' },
        { id: '7', label: '特来电' },
        { id: '8', label: '循道新能源' },
        { id: '9', label: '富电科技' },
        { id: '10', label: '华商三优' },
        { id: '11', label: '中電' },
        { id: '12', label: '港燈' },
        { id: '13', label: '澳電' },
        { id: '14', label: '绿狗' },
        { id: '15', label: 'EVCARD' },
        { id: '16', label: '星星充电' },
        { id: '17', label: '电桩' },
        { id: '18', label: '依威能源' }
    ];
    $scope.chargingOpenType = FM.dataApi.Constant.chargingOpenType;
    $scope.chargingOpenTypeChange = function (event) {
        var obj = $scope.poi.chargingstations[0].changeOpenType;
        var rejectVal = '1';
        Utils.setCheckboxMutex(event, obj, rejectVal);
    };
    $scope.parkingFeesArr = FM.dataApi.Constant.parkingFees;
    $scope.stationAvailableState = [   // 充电站类型
        { id: 0, label: '开放' },
        { id: 1, label: '未开放' },
        { id: 2, label: '维修中' },
        { id: 3, label: '建设中' },
        { id: 4, label: '规划中' }
    ];

    $scope.chainList = {};
    /* 初始化品牌*/
    $scope.initChain = function () {
        var allChain = $scope.metaData.allChain;
        for (var i in allChain) {
            if(i == '230218' || i == '230227'){
                for (var j = 0 ; j < allChain[i].length ; j++){
                    var cha = allChain[i][j];
                    if(cha.chainCode && cha.chainCode != '0'){
                        $scope.chainList[cha.chainCode] = { // 转换成chosen-select可以解析的格式
                            category: cha.category,
                            chainCode: cha.chainCode,
                            weight: cha.weight,
                            chainName: cha.chainName
                        };
                    }
                }
            }
        }
        console.info($scope.chainList);
    };
    $scope.initChain();
});
