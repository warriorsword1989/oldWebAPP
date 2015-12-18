/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    $scope.selectClaArr = $scope.$parent.$parent.classArr;
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl =  fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var tooltipsCtrl=fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrict = layerCtrl.getLayerById('referencePoint');
    var workPoint = layerCtrl.getLayerById('workPoint');
    $scope.toolTipText = "";
    $scope.selectShape = function (type, num) {
        tooltipsCtrl.setMap(map,"tooltip");
        if(highLightLayer.highLightLayersArr.length!==0) {
            highLightLayer.removeHighLightLayers();
        }
        if(tooltipsCtrl.getCurrentTooltip()){
            tooltipsCtrl.onRemoveTooltip();
        }
        if (type === "link") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.dataTipsURL = "";//清除弹出的datatips面板
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referenceLine');

            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink,linksFlag:true});
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择线！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
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
                    if(objCtrl.updateObject!=="") {
                        objCtrl.updateObject();
                    }
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                    })
                })

            })


        }

        if (type === "node") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.dataTipsURL = "";//清除弹出的datatips面板
            $scope.$parent.$parent.changeBtnClass(num);
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
        }
        if (type === "relation") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referencePoint');
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectNode({map: map, currentEditLayer: restrict});
            map.currentTool.enable();
            restrict.options.selectType = 'relation';
            restrict.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            $scope.toolTipText= '请选择交线！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            restrict.on("getNodeId", function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    if(objCtrl.rdrestrictionObject!=="") {
                        objCtrl.rdrestrictionObject();
                    }
                    tooltipsCtrl.onRemoveTooltip();
                    $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                        if ($scope.tips === 0) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                        } else if ($scope.type === 1) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfTruckTepl.html";
                        }

                    })

                })


            })
        }
        if (type == "tips") {
            $scope.toolTipText = '请选择tips！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('workPoint');
            if (typeof map.currentTool.cleanHeight === "function") {
                map.currentTool.cleanHeight();
            }
            map.currentTool = new fastmap.uikit.SelectDataTips({map: map, currentEditLayer: workPoint});
            map.currentTool.enable();
            workPoint.options.selectType = 'tips';
            workPoint.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";

            workPoint.on("getNodeId", function (data) {
                $scope.data = data;
                $("#popoverTips").css("display", "block");
                Application.functions.getTipsResult(data.id, function (data) {
                    if (data.rowkey === "undefined") {
                        return;
                    }
                    $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;
                    if ($scope.$parent.$parent.updateDataTips !== "") {
                        $scope.$parent.$parent.updateDataTips(data);
                    }
                    selectCtrl.fire("selectByAttribute", {feather: data});

                    if (data.t_lifecycle === 1) {

                        var tracInfoArr = data.t_trackInfo, trackInfoFlag = false;

                        for (var trackNum = 0, trackLen = tracInfoArr.length; trackNum < trackLen; trackNum++) {
                            if (tracInfoArr[trackNum].stage === 3) {
                                trackInfoFlag = true;
                                break;
                            }
                        }
                        if (trackInfoFlag) {
                            $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                $scope.$parent.$parent.objectEditURL = "";
                            });
                        } else {
                            Application.functions.getRdObjectById(data.resID[0].id, "RDRESTRICTION", function (data) {
                                objCtrl.setCurrentObject(data.data);
                                if(objCtrl.tipsUpdateObject!=="") {
                                    objCtrl.tipsUpdateObject();
                                }

                                $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                    $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                    });
                                });
                            })
                        }
                        tooltipsCtrl.onRemoveTooltip();
                    } else {
                        if (data.resID[0].id === 0) {
                            $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                $scope.$parent.$parent.objectEditURL = "";
                            });
                        } else {
                            Application.functions.getRdObjectById(data.resID[0].id, "RDRESTRICTION", function (data) {
                                objCtrl.setCurrentObject(data.data);
                               if(objCtrl.tipsUpdateObject!=="") {
                                   objCtrl.tipsUpdateObject();
                               }
                                $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                                    $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                                    $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                                        $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                                    });
                                });
                            })
                        }
                        tooltipsCtrl.onRemoveTooltip();
                    }



            })
        }
        )
    }

};
}])