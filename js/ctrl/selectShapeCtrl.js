/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    $scope.selectClaArr = $scope.$parent.$parent.classArr;
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrict = layerCtrl.getLayerById('referencePoint');
    var rdCross = layerCtrl.getLayerById("rdcross")
    var workPoint = layerCtrl.getLayerById('workPoint');
    $scope.toolTipText = "";

    $scope.showTipsOrProperty = function (data, type, objCtrl, propertyCtrl, propertyTepl) {
        $scope.$parent.$parent.objectEditURL = "";
        $ocLazyLoad.load("ctrl/sceneAllTipsCtrl").then(function () {
            $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
            if (data.t_lifecycle === 2) {
                Application.functions.getRdObjectById(data.f.id, type, function (data) {
                    objCtrl.setCurrentObject(data);
                    if (objCtrl.tipsUpdateObject !== "") {
                        objCtrl.tipsUpdateObject();
                    }
                    $ocLazyLoad.load(propertyCtrl).then(function () {
                        $scope.$parent.$parent.objectEditURL = propertyTepl;

                    });
                });
            } else {
                var stageLen = data.t_trackInfo.length;
                var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                if (stage === 1) {
                    if (data.s_sourceType === "1201") {
                        Application.functions.getRdObjectById(data.f.id, type, function (data) {
                            objCtrl.setCurrentObject(data);
                            if (objCtrl.tipsUpdateObject !== "") {
                                objCtrl.tipsUpdateObject();
                            }
                            $ocLazyLoad.load(propertyCtrl).then(function () {
                                $scope.$parent.$parent.objectEditURL = propertyTepl;
                            });
                        });
                    } else {
                        if (data.t_lifecycle === 1) {
                            Application.functions.getRdObjectById(data.f.id, type, function (data) {
                                objCtrl.setCurrentObject(data);
                                if (objCtrl.tipsUpdateObject !== "") {
                                    objCtrl.tipsUpdateObject();
                                }
                                $ocLazyLoad.load(propertyCtrl).then(function () {
                                    $scope.$parent.$parent.objectEditURL = propertyTepl;

                                });
                            });
                        }
                    }


                } else if (stage === 3) {
                    if (data.t_lifecycle === 3) {
                        Application.functions.getRdObjectById(data.f.id, type, function (data) {
                            objCtrl.setCurrentObject(data);
                            if (objCtrl.tipsUpdateObject !== "") {
                                objCtrl.tipsUpdateObject();
                            }
                            $ocLazyLoad.load(propertyCtrl).then(function () {
                                $scope.$parent.$parent.objectEditURL = propertyTepl;

                            });
                        });
                    }
                }
            }
        });

    }
    $scope.selectShape = function (type, num) {
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
        }
        if (type === "link") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.dataTipsURL = "";//清除弹出的datatips面板
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referenceLine');


            map.currentTool = new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink, linksFlag: true});
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择线！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            rdLink.options.selectType = 'link';
            $scope.$parent.$parent.objectEditURL = "";
            rdLink.options.editable = true;
            //清除link层的所有监听事件
            rdLink.clearAllEventListeners()
            rdLink.on("getId", function (data) {
                $scope.data = data;
                console.log("data" + data);
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
                    selectCtrl.onSelected({
                        geometry: line,
                        id: $scope.data.id,
                        direct: data.data.direct,
                        snode: data.data.sNodePid,
                        enode: data.data.eNodePid,
                        point: $scope.data.point
                    });
                    objCtrl.setCurrentObject(data);
                    if (objCtrl.updateObject !== "") {
                        objCtrl.updateObject();
                    }
                    $ocLazyLoad.load('ctrl/linkObjectCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
                    })
                })

            })


        }

        else if (type === "node") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.dataTipsURL = "";//清除弹出的datatips面板
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('edit');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            $scope.$parent.$parent.objectEditURL = "";
            $scope.toolTipText = '请选择node！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            //清除link层的所有监听事件
            rdLink.clearAllEventListeners()
            rdLink.on("getId", function (data) {
                $scope.data = data;
                Application.functions.getLinksbyNodeId(JSON.stringify({
                    projectId: 11,
                    type: 'RDLINK',
                    data: {nodePid: data.id}
                }), function (data) {
                    if (data.errcode === -1) {
                        return;
                    }
                    var lines = []
                    for (var index in data.data) {
                        var linkArr = data.data[index].geometry.coordinates || data[index].geometry.coordinates, points = [];
                        for (var i = 0, len = linkArr.length; i < len; i++) {
                            var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                            points.push(point);
                        }
                        //var line = fastmap.mapApi.lineString(points);
                        lines.push(points);
                    }

                    var multipolyline = fastmap.mapApi.multiPolyline(lines);

                    var editLyer = layerCtrl.getLayerById('edit');
                    layerCtrl.pushLayerFront('edit');
                    var sobj = shapeCtrl.shapeEditorResult;
                    editLyer.drawGeometry = multipolyline;
                    editLyer.draw(multipolyline, editLyer);
                    sobj.setOriginalGeometry(multipolyline);
                    sobj.setFinalGeometry(multipolyline);

                    selectCtrl.onSelected({geometry: multipolyline, id: $scope.data.id});

                    if (shapeCtrl.getCurrentTool()['options']) {
                        shapeCtrl.stopEditing();
                    }

                    shapeCtrl.setEditingType('pathNodeMove');
                    shapeCtrl.startEditing();
                    shapeCtrl.on("startshapeeditresultfeedback", saveOrEsc);
                    shapeCtrl.on("stopshapeeditresultfeedback", function () {
                        shapeCtrl.off("startshapeeditresultfeedback", saveOrEsc);
                    });


                    Application.functions.getRdObjectById($scope.data.id, "RDNODE", function (data) {
                        objCtrl.setCurrentObject(data);
                        if (objCtrl.updateObject !== "") {
                            objCtrl.updateObject();
                        }
                        $ocLazyLoad.load('ctrl/rdNodeFromCtrl').then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/rdNodeFromTepl.html";
                        })
                    });


                })
            });
        }
        else if (type === "relation") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('referencePoint');
            map.currentTool = new fastmap.uikit.SelectRestriction({map: map, currentEditLayer: restrict});
            map.currentTool.enable();
            restrict.options.selectType = 'relation';
            restrict.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            $scope.toolTipText = '请选择交限！'; 
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            restrict.on("getNodeId", function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                Application.functions.getRdObjectById(data.id, "RDRESTRICTION", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    if (objCtrl.rdrestrictionObject !== "") {
                        objCtrl.rdrestrictionObject();
                    }
                    tooltipsCtrl.onRemoveTooltip();
                    $ocLazyLoad.load('ctrl/rdRestriction').then(function () {
                        if ($scope.tips === 0) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                        } else if ($scope.type === 1) {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfTruckTepl.html";
                        }
                    })

                })


            })
        }
        else if (type === "tips") {
            $scope.toolTipText = '请选择tips！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('workPoint');
            map.currentTool = new fastmap.uikit.SelectDataTips({map: map, currentEditLayer: workPoint});
            map.currentTool.enable();
            workPoint.options.selectType = 'tips';
            workPoint.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            var type, propertyCtrl, propertyTepl;
            workPoint.on("getNodeId", function (data) {
                    $scope.data = data;
                    $("#popoverTips").css("display", "block");
                    Application.functions.getTipsResult(data.id, function (data) {
                        if (data.rowkey === "undefined") {
                            return;
                        }
                        selectCtrl.fire("selectByAttribute", {feather: data});


                        console.log(data.s_sourceType);
                        switch (data.s_sourceType) {
                            case "2001"://测线
                            case "1201"://种别
                                type = "RDLINK";
                                propertyCtrl = "ctrl/linkObjectCtrl";
                                propertyTepl = "js/tepl/currentObjectTepl.html";
                                $scope.showTipsOrProperty(data, type, objCtrl, propertyCtrl, propertyTepl);
                                break;
                            case  "1704"://交叉路口
                                $ocLazyLoad.load('ctrl/sceneAllTipsCtrl').then(function () {
                                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneAllTipsTepl.html";
                                    if (data.f.id) {
                                        var obj = {"nodePid": parseInt(data.f.id)};
                                        var param = {
                                            "projectId": 11,
                                            "type": "RDCROSS",
                                            "data": obj
                                        }
                                        Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                            objCtrl.setCurrentObject(data.data[0]);
                                            $ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                                                $scope.$parent.$parent.objectEditURL = "js/tepl/rdCrossTepl.html";

                                            });
                                        });
                                    }

                                });
                                break;

                        }

                        if (selectCtrl.updateTipsCtrl !== "") {
                            selectCtrl.updateTipsCtrl();
                        }


                        $scope.$parent.$parent.rowkeyOfDataTips = data.rowkey;


                    })
                }
            )
        }
        else if (type === "rdCross") {
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
            $scope.$parent.$parent.changeBtnClass(num);
            layerCtrl.pushLayerFront('rdcross');
            map.currentTool = new fastmap.uikit.SelectNode({map: map, currentEditLayer: rdCross});
            map.currentTool.enable();
            rdCross.options.selectType = 'relation';
            rdCross.options.editable = true;
            $scope.$parent.$parent.objectEditURL = "";
            $scope.toolTipText = '请选择路口！';
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            rdCross.on("getNodeId", function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                Application.functions.getRdObjectById(data.id, "RDCROSS", function (data) {
                    $scope.$parent.$parent.objectEditURL = "";
                    objCtrl.setCurrentObject(data.data);
                    if (objCtrl.updateRdCross !== "") {
                        objCtrl.updateRdCross();
                    }
                    tooltipsCtrl.onRemoveTooltip();
                    $ocLazyLoad.load('ctrl/rdCrossCtrl').then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/rdCrossTepl.html";
                    });

                })


            })

        }

        function saveOrEsc(event) {
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("点击空格键保存操作或者按ESC键取消!");
        };

    };
}])