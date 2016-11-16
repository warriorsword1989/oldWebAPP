var oridinaryInfoApp = angular.module('app', []);
oridinaryInfoApp.controller('carTypeController', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();

    $scope.carData = [];
    $scope.vehicleOptions = [
        { id: 0, label: '客车(小汽车)', checked: false },
        { id: 1, label: '配送卡车', checked: false },
        { id: 2, label: '运输卡车', checked: false },
        { id: 3, label: '步行者', checked: false },
        { id: 4, label: '自行车', checked: false },
        { id: 5, label: '摩托车', checked: false },
        { id: 6, label: '机动脚踏两用车', checked: false },
        { id: 7, label: '急救车', checked: false },
        { id: 8, label: '出租车', checked: false },
        { id: 9, label: '公交车', checked: false },
        { id: 10, label: '工程车', checked: false },
        { id: 11, label: '本地车辆', checked: false },
        { id: 12, label: '自用车辆', checked: false },
        { id: 13, label: '多人乘坐车辆', checked: false },
        { id: 14, label: '军车', checked: false },
        { id: 15, label: '有拖车的车', checked: false },
        { id: 16, label: '私营公共汽车', checked: false },
        { id: 17, label: '农用车', checked: false },
        { id: 18, label: '载有易爆品的车辆', checked: false },
        { id: 19, label: '载有水污染品的车辆', checked: false },
        { id: 20, label: '载有其它危险品的车辆', checked: false },
        { id: 21, label: '电车', checked: false },
        { id: 22, label: '轻轨', checked: false },
        { id: 23, label: '校车', checked: false },
        { id: 24, label: '四轮驱动车', checked: false },
        { id: 25, label: '装有防雪链的车', checked: false },
        { id: 26, label: '邮政车', checked: false },
        { id: 27, label: '槽罐车', checked: false },
        { id: 28, label: '残疾人车', checked: false },
        { id: 29, label: '预留', checked: false },
        { id: 30, label: '预留', checked: false }
    ];

    // 初始化vehicleOptions方法
    $scope.initVehicleOptions = function () {
        /** *******如果窗口打开状态，窗口关闭*/
        if ($('body .carTypeTip:last').show()) {
            $('body .carTypeTip:last').hide();
        }
        angular.forEach($scope.vehicleOptions, function (item) {
            item.checked = false;
        });
    };
    $scope.showvehicle = function (vehicle) {
        // 每次初始化vehicleOptions
        $scope.initVehicleOptions();
        var towbin = dec2bin(vehicle);
        $scope.carData = [];
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        $scope.checkValue = false;
        var len = towbin.length - 1;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            $scope.checkValue = false;
        } else {
            len = towbin.length - 2;
            $scope.checkValue = true;
        }
        for (var i = len; i >= 0; i--) {
            if (towbin.split('').reverse().join('')[i] == 1) {
                originArray.push($scope.vehicleOptions[i]);
            }
        }

        if (originArray.length == 0) {
            $scope.carData = [];
        } else {
            for (var p in originArray) {
                for (var s in $scope.vehicleOptions) {
                    if (originArray[p].id.toString() == $scope.vehicleOptions[s].id) {
                        $scope.vehicleOptions[s].checked = true;
                        $scope.carData.push($scope.vehicleOptions[s]);
                    }
                }
            }
        }
    };

    $scope.showPopover = function (e) {
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        $('body').append($(e.target).parents('.date-well').find('.carTypeTip'));
        if ($('body .carTypeTip:last').css('display') == 'none') {
            $('.carTypeTip').css({ top: ($(e.target).offset().top - 100) + 'px', right: (dateTimeWell.attr('data-type') == 1) ? '300px' : '600px' });
            $('body .carTypeTip:last').show();
        } else {
            $('body .carTypeTip:last').hide();
        }
        $('body .datetip:last').hide();// 关闭时间控件
    };

    $scope.hidePopover = function (t) {
        $('body .carTypeTip:last').hide();
    };

    $scope.carSelect = function (item) {
        if (item.checked) {
            item.checked = false;
            for (var i in $scope.carData) {
                if ($scope.carData[i].id.toString() == item.id) {
                    $scope.carData.splice(i, 1);
                }
            }
        } else {
            item.checked = true;
            $scope.carData.push(item);
        }
        $scope.checkViche();
    };

    $scope.checkViche = function () {
        var newArray = [];
        var result = '';
        for (var j = 0; j < $scope.carData.length; j++) {
            newArray.push($scope.carData[j].id);
        }
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if ($scope.checkValue) {
                    result += '1';// 允许
                } else {
                    result += '0';// 禁止
                }
            } else if ($.inArray(i, newArray) != -1) {
                result += '1';
            } else {
                result += '0';
            }
        }
        objCtrl.data.vehicle = parseInt(bin2dec(result));
    };

    $scope.initializeData = function () {
        $scope.rdWarningInfoObj = objCtrl.data.getIntegrate();
        $scope.showvehicle($scope.rdWarningInfoObj.vehicle);
    };

    $scope.initializeData();
    eventCtrl.off(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE);
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE, $scope.initializeData);
});
