/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    $scope.selectClaArr = $scope.$parent.$parent.classArr;
    $scope.selectShape = function (type, num) {
        var selectCtrl = new fastmap.uikit.SelectController();
        var objCtrl = new fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        if (type === "link") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referenceLine');
            var rdLink = layerCtrl.getLayerById('referenceLine');
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink});
            map.currentTool.enable();
            rdLink.options.selectType = 'link';
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.options.editable = true;
            rdLink.on("getId", function (data) {
                $scope.data = data;
                Application.functions.getRdObjectById(data.id, "RDLINK", function (data) {
                    if (data.errcode === -1) {
                        return;
                    }
                    var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    var line = fastmap.mapApi.lineString(points);

                    selectCtrl.onSelected({geometry: line, id: $scope.data.id});
                    objCtrl.setCurrentObject(data);
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {

                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                        if ($scope.$parent.$parent.updateLinkData !== "") {
                            $scope.$parent.$parent.updateLinkData(data.data);
                        }

                    })


                })

            })


        }

        if (type === "node") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            var rdLink = layerCtrl.getLayerById('referenceLine');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
        }
        if (type === "relation") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referencePoint');
            var rdLink = layerCtrl.getLayerById('referencePoint');
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectNode({map: map, currentEditLayer: rdLink});
            map.currentTool.enable();
            rdLink.options.selectType = 'relation';
            rdLink.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.on("getNodeId", function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    $scope.$parent.$parent.rdRestrictData = data.data;
                    $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                        if ($scope.tips === 0) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                            if ($scope.$parent.$parent.updateRestrictData !== "") {
                                $scope.$parent.$parent.updateRestrictData(data.data);
                            }
                        } else if ($scope.type === 1) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfTruckTepl.html";
                        }

                    })
                })


            })
        }
        if (type == "tips") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('workPoint');
            var rdLink = layerCtrl.getLayerById('workPoint');
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectDataTips({map: map, currentEditLayer: rdLink});
            map.currentTool.enable();
            rdLink.options.selectType = 'tips';
            rdLink.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.on("getNodeId", function (data) {
                $scope.data = data;
                $("#popoverTips").css("display", "block");
                Application.functions.getTipsResult(data.id, function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    if ($scope.$parent.$parent.updateDataTips !== "") {
                        $scope.$parent.$parent.updateDataTips(data);
                    }
                    selectCtrl.fire("selectByAttribute", {feather: data});
                    var id = data.resID[0].id;
                    if (id === 0 || id === "0") {
                        //var oriDataTipsData = {};
                        //oriDataTipsData.inLinkPid = 0;
                        //oriDataTipsData.details = [];
                        //var outLinkObj = {};
                        //outLinkObj.conditions = [];
                        //outLinkObj.outLinkPid = 0;
                        //outLinkObj.flag = 0;
                        //outLinkObj.relationshipType = 0;
                        //outLinkObj.restricInfo = 0;
                        //outLinkObj.type = 0;
                        //oriDataTipsData.details.push(outLinkObj);
                        //objCtrl.setCurrentObject(oriDataTipsData);
                        //$scope.$parent.$parent.rdRestrictData = oriDataTipsData;
                        $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                        });

                    } else {
                        Application.functions.getRdObjectById(id, "RDRESTRICTION", function (data) {
                            objCtrl.setCurrentObject(data.data);
                            $scope.$parent.$parent.rdRestrictData = data.data;
                            $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                                $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                });
                            });
                        })
                    }

                })
            })
        }

    };
}])