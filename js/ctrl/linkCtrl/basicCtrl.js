/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("lazymodule", ['oc.lazyLoad']);
basicApp.controller("basicController",function($scope,$ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.kindOptions = [
        {"id": 0, "label": "0 作业中"},
        {"id": 1, "label": "1 高速道路"},
        {"id": 2, "label": "2 城市高速"},
        {"id": 3, "label": "3 国道"},
        {"id": 4, "label": "4 省道"},
        {"id": 5, "label": "5 预留"},
        {"id": 6, "label": "6 县道"},
        {"id": 7, "label": "7 乡镇村道路"},
        {"id": 8, "label": "8 其它道路"},
        {"id": 9, "label": "9 非引导道路"},
        {"id": 10, "label": "10 步行道路"},
        {"id": 11, "label": "11 人渡"},
        {"id": 13, "label": "13 轮渡"},
        {"id": 15, "label": "15 10级路(障碍物)"}
    ];
    $scope.laneClassOptions = [
        {"id": 0, "label": "0 未赋值"},
        {"id": 1, "label": "1 一条车道"},
        {"id": 2, "label": "2 2或3条"},
        {"id": 3,"label":"3 4条及以上"}
    ];
    $scope.imiCodeOptions = [
        {"id": 0, "label": "0 其他道路"},
        {"id": 1, "label": "1 交叉点内部道路"},
        {"id": 2, "label": "2 转弯道"},
        {"id": 3, "label": "3 无法描述的"}
    ];
    $scope.functionClassOptions = [
        {"id": 0, "label": "0 未赋值"},
        {"id": 1, "label": "1 等级1"},
        {"id": 2, "label": "2 等级2"},
        {"id": 3, "label": "3 等级3"},
        {"id": 4, "label": "4 等级4"},
        {"id": 5, "label": "5 等级5"}
    ];
    $scope.nameTypeOptions = [
        {"id": 0, "label": "0 普通"},
        {"id": 1, "label": "1 立交桥名(链接路)"},
        {"id": 2, "label": "2 立交桥名(主路)"},
        {"id": 3, "label": "3 风景线路"},
        {"id": 4, "label": "4 桥"},
        {"id": 5, "label": "5 隧道"},
        {"id": 6, "label": "6 虚拟名称"},
        {"id": 7, "label": "7 出口编号"},
        {"id": 8, "label": "8 编号名称"},
        {"id": 9, "label": "9 虚拟连接名称"},
        {"id": 14, "label": "14 点门牌"},
        {"id": 15, "label": "15 线门牌"}
    ];


    $scope.showNames=function() {
        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/namesOfLinkCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/namesOfLinkTepl.html";
        })
    };





})