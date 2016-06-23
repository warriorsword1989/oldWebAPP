angular.module('app').controller('generalBaseCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi', 'dsMeta', 'appPath', function($scope, $ocll, $q, dsPoi, dsMeta, appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var evtCtrl = fastmap.uikit.EventController();

    function initData() {
        $scope.poi = objCtrl.data;
        _retreatData($scope.poi);
        /**
         * 名称组可地址组特殊处理（暂时只做了大陆的控制）
         * 将名称组中的21CHI的名称放置在name中，如果不存在21CHI的数据，则给name赋值默认数据
         * 将地址组中CHI的地址放置在address中，如果不存在CHI的数据，则给address赋值默认数据
         * @param data
         */
        function _retreatData(data) {
            var flag = true;
            for (var i = 0, len = data.names.length; i < len; i++) {
                if (data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == "CHI") {
                    flag = false;
                    data.name = data.names[i];
                    break;
                }
            }
            if (flag) {
                var name = new FM.dataApi.IxPoiName({
                    langCode: "CHI",
                    nameClass: 1,
                    nameType: 2,
                    name: ""
                });
                data.name = name;
            }
            flag = true;
            for (var i = 0, len = data.addresses.length; i < len; i++) {
                if (data.addresses[i].langCode == "CHI") {
                    flag = false;
                    data.address = data.addresses[i];
                    break;
                }
            }
            if (flag) {
                var address = new FM.dataApi.IxPoiAddress({
                    langCode: "CHI",
                    fullname: ""
                });
                data.address = address;
            }
        }
    }
    initData();
    /*切换tag按钮*/
    $scope.changeProperty = function(tagName) {
        $scope.propertyType = tagName;
        switch (tagName) {
            case 'base':
                $ocll.load(appPath.poi + 'ctrls/attr-base/baseInfoCtl').then(function() {
                    $scope.baseInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/baseInfoTpl.html';
                });
                break;
            case 'deep':
                break;
            case 'relate':
                $ocll.load(appPath.poi + 'ctrls/attr-base/relationInfoCtl').then(function() {
                    $scope.relationInfoTpl = appPath.root + appPath.poi + 'tpls/attr-base/relationInfoTpl.html';
                });
                break;
            case 'file':
                $ocll.load(appPath.poi + 'ctrls/edit-tools/fileUploadCtl').then(function() {
                    $scope.fileUploadTpl = appPath.root + appPath.poi + 'tpls/edit-tools/fileUploadTpl.html';
                });
                break;
            default:
                $ocll.load(appPath.poi + 'edit-tools/checkResultCtl').then(function() {
                    $scope.tagContentTpl = appPath.root + appPath.poi + 'tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    //接收分类改变后出发的事件
    $scope.$on("kindChange", function(event, data) {
        switch (data.extend) {
            case 1: //停车场
                $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2: //加油站
                $ocll.load(appPath.poi + "ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/oilStationTpl.html";
                });
                break;
                // case 3: //充电站
                //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                //     });
                //     break;
            case 4: //宾馆酒店
                $ocll.load(appPath.poi + "ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5: //运动场馆
                $ocll.load(appPath.poi + "ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6: //餐馆
                $ocll.load(appPath.poi + "ctrls/attr-deep/restaurantCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/restaurantTpl.html";
                });
                dsMeta.queryFoodType($scope.poi.kindCode).then(function(ret) {
                    parseFoodType(ret);
                });
                break;
            case 7: //加气站
                $ocll.load(appPath.poi + "ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/gasStationTpl.html";
                });
                break;
                // case 8: //旅游景点
                //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                //     });
                //     break;
            case 9:
                $ocll.load(appPath.poi + "ctrls/attr-deep/parkingCtl").then(function() {
                    // $ocll.load("components/poi/drtvs/directives/select2_drtv").then(function() {
                    $scope.deepInfoTpl = appPath.root + appPath.poi + "tpls/attr-deep/parkingTpl.html";
                    $scope.$on('$includeContentLoaded', function($event) {
                        $scope.$broadcast("loaded", data);
                    });
                    // });
                });
                break;
            default:
                $scope.deepInfoTpl = "";
                break;
        }
    });
    /*默认显示baseInfo的tab页*/
    function initShowTag() {
        $scope.propertyType = "base";
        $scope.changeProperty('base');
    }
    initShowTag();
    //清除样式
    $scope.$on("clearBaseInfo", function() {
        $scope.nodeForm.$setPristine(); //清除ng-ditry
        $scope.controlFlag.isTelEmptyArr = []; //清除异常电话样式
    });

    function parseFoodType(foodType) {
        if (foodType.length > 0) {
            $scope.foodType1Obj = {};
            $scope.foodType2Obj = {};
            for (var i = 0, n = foodType.length; i < n; i++) {
                if (foodType[i].foodType == "A" || foodType[i].foodType == "C") {
                    $scope.foodType1Obj[foodType[i].foodCode] = foodType[i].foodName;
                } else {
                    $scope.foodType2Obj[foodType[i].foodCode] = foodType[i].foodName;
                }
            }
        }
    }
    // evtCtrl.rebindEvent = evtCtrl.rebindEvent || {};
    // evtCtrl.rebindEvent["attrTplContainer"] = function() {
    //     evtCtrl.off(evtCtrl.eventTypes.SELECTEDFEATURECHANGE);
        evtCtrl.on(evtCtrl.eventTypes.SELECTEDFEATURECHANGE, initData);
    // };
}]);