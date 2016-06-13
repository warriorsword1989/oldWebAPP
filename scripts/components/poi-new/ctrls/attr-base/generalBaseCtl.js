angular.module('app').controller('generalBaseCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {

    /*切换tag按钮*/
    $scope.changeProperty = function (tagName) {
        $scope.propertyType = tagName;
        switch (tagName) {
            case 'base':
                $ocll.load('scripts/components/poi-new/ctrls/attr-base/baseInfoCtl').then(function () {
                    $scope.baseInfoTpl = '../../../scripts/components/poi-new/tpls/attr-base/baseInfoTpl.html';
                });
                break;
            case 'deep':

                break;
            case 'relate':
                $ocll.load('scripts/components/poi-new/ctrls/attr-base/relationInfoCtl').then(function () {
                    $scope.relationInfoTpl = '../../../scripts/components/poi-new/tpls/attr-base/relationInfoTpl.html';
                });
                break;
            case 'file':
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/fileUploadCtl').then(function() {
                    $scope.fileUploadTpl = '../../../scripts/components/poi-new/tpls/edit-tools/fileUploadTpl.html';
                });
                break;
            default:
                $ocll.load('scripts/components/poi-new/ctrls/edit-tools/checkResultCtl').then(function () {
                    $scope.tagContentTpl = '../../../scripts/components/poi-new/tpls/edit-tools/checkResultTpl.html';
                });
                break;
        }
    };
    //接收分类改变后出发的事件
    $scope.$on("kindChange", function(event, data) {
        switch (data.extend) {
            case 1: //停车场
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                });
                break;
            case 2: //加油站
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/oilStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/oilStationTpl.html";
                });
                break;
            // case 3: //充电站
            //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
            //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
            //     });
            //     break;
            case 4: //宾馆酒店
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/hotelCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/hotelTpl.html";
                });
                break;
            case 5: //运动场馆
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/sportsVenuesCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/sportsVenuesTpl.html";
                });
                break;
            case 6: //餐馆
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/restaurantCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/restaurantTpl.html";
                });
                break;
            case 7: //加气站
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/gasStationCtl").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/gasStationTpl.html";
                });
                break;
            // case 8: //旅游景点
            //     $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
            //         $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
            //     });
            //     break;
            case 9:
                $ocll.load("scripts/components/poi-new/ctrls/attr-deep/parkingCtl").then(function() {
                    // $ocll.load("components/poi/drtvs/directives/select2_drtv").then(function() {
                    $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
                    $scope.$on('$includeContentLoaded', function ($event) {
                        $scope.$broadcast("loaded", data);
                    });
                    // });
                });
                break;
            // default:
            //     $scope.deepInfoTpl = "../../../scripts/components/poi-new/tpls/attr-deep/parkingTpl.html";
            //     break;
        }
    });

    /*默认显示baseInfo的tab页*/
    function initShowTag(){
        $scope.propertyType = "base";
        $scope.changeProperty('base');
    }

    initShowTag();
    
    //清除样式
    $scope.$on("clearBaseInfo",function (){
        $scope.nodeForm.$setPristine(); //清除ng-ditry
        $scope.controlFlag.isTelEmptyArr = []; //清除异常电话样式
    });
}]);