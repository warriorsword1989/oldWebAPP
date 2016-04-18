/**
 * Created by wangmingdong on 2016/4/8.
 */
var braPassline = angular.module("mapApp", ['oc.lazyLoad']);
braPassline.controller("3dBraPasslineCtrl", function ($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
     $scope.vias = objCtrl.data.vias?objCtrl.data.vias:0;
});