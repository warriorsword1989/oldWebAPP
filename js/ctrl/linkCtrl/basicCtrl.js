/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("mapApp", ['oc.lazyLoad']);
basicApp.controller("basicController",function($scope,$ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.kindOptions = [
        {"id": 0, "label": "作业中"},
        {"id": 1, "label": "高速道路"},
        {"id": 2, "label": "城市高速"},
        {"id": 3, "label": "国道"},
        {"id": 4, "label": "省道"},
        {"id": 5, "label": "预留"},
        {"id": 6, "label": "县道"},
        {"id": 7, "label": "乡镇村道路"},
        {"id": 8, "label": "其它道路"},
        {"id": 9, "label": "非引导道路"},
        {"id": 10, "label": "步行道路"},
        {"id": 11, "label": "人渡"},
        {"id": 13, "label": "轮渡"},
        {"id": 15, "label": "10级路(障碍物)"}
    ];
    $scope.laneClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "一条车道"},
        {"id": 2, "label": "2或3条"},
        {"id": 3,"label":"4条及以上"}
    ];
    $scope.imiCodeOptions = [
        {"id": 0, "label": "其他道路"},
        {"id": 1, "label": "交叉点内部道路"},
        {"id": 2, "label": "转弯道"},
        {"id": 3, "label": "无法描述的"}
    ];
    $scope.functionClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "等级1"},
        {"id": 2, "label": "等级2"},
        {"id": 3, "label": "等级3"},
        {"id": 4, "label": "等级4"},
        {"id": 5, "label": "等级5"}
    ];
    $scope.nameTypeOptions = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "立交桥名(链接路)"},
        {"id": 2, "label": "立交桥名(主路)"},
        {"id": 3, "label": "风景线路"},
        {"id": 4, "label": "桥"},
        {"id": 5, "label": "隧道"},
        {"id": 6, "label": "虚拟名称"},
        {"id": 7, "label": "出口编号"},
        {"id": 8, "label": "编号名称"},
        {"id": 9, "label": "虚拟连接名称"},
        {"id": 14, "label": "点门牌"},
        {"id": 15, "label": "线门牌"}
    ];


    $scope.showNames=function() {
        if(! $scope.$parent.$parent.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.$parent.$parent.suspendFlag = true;
        }

        $scope.$parent.$parent.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/linkCtrl/namesOfLinkCtrl').then(function () {
            $scope.$parent.$parent.$parent.$parent.suspendObjURL = "js/tepl/linkObjTepl/namesOfLinkTepl.html";
        })
    };


})