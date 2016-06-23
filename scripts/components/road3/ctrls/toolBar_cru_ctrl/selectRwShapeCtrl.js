/**
 * Created by mali on 2016/6/22.
 */
angular.module("app").controller("selectRwShapeController", ["$scope", '$ocLazyLoad', '$rootScope','appPath','dsRoad', function ($scope, $ocLazyLoad, $rootScope,appPath,dsRoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rwLink = layerCtrl.getLayerById('rwLink');
    var rwNode = layerCtrl.getLayerById('rwNode');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.toolTipText = "";
    /**
     * 重新设置选择工具
     */
    $scope.resetToolAndMap = function () {
        if (map.currentTool && typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
            map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        }
        //清空高亮
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        //移除提示信息
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        //清空编辑图层和shapeCtrl
        editLayer.drawGeometry = null;
        shapeCtrl.stopEditing();
        editLayer.bringToBack();
        $(editLayer.options._div).unbind();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        editLayer.clear();
    };
    $scope.selectRwShape = function (type, num) {
        //重置选择工具
        $scope.resetToolAndMap();

        //移除上一步中的悬浮按钮
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        //重置上一步中的属性栏和tips框
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
        $("#popoverTips").hide();

        $scope.changeBtnClass(num);

        //连续点击选择按钮的操作
        if (!$scope.classArr[num]) {
            map.currentTool.disable();
            map._container.style.cursor = '';
            return;
        }

        if (type === "RWLINK") {
            layerCtrl.pushLayerFront('edit');//把editlayer置顶

            //初始化选择线工具
            map.currentTool = new fastmap.uikit.SelectPath(
                {
                    map: map,
                    currentEditLayer: rwLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });

            //把线图层添加到捕捉工具中
            map.currentTool.snapHandler.addGuideLayer(rwLink);
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择RWLINK！';
            eventController.off(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETLINKID, $scope.selectObjCallback);
        }
        else if (type === "RWNODE") {
            //初始化选择点工具
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                nodesFlag: true,
                currentEditLayer: rwNode,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();

            //把点和线图层加到捕捉工具中
            map.currentTool.snapHandler.addGuideLayer(rwLink);
            map.currentTool.snapHandler.addGuideLayer(rwNode);
            //初始化鼠标提示
            $scope.toolTipText = '请选择RWNODE！';

            eventController.off(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETNODEID, $scope.selectObjCallback);
        }
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
    };
    $scope.selectObjCallback = function (data) {
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        var ctrlAndTplParams = {
            propertyCtrl: "",
            propertyHtml: ""
        }, toolsObj = null;
        $scope.type = null;
        switch (data.optype) {
            case "NODE":
                toolsObj = {
                    items: [{
                        'text': "<a class='glyphicon glyphicon-move'></a>",
                        'title': "移动RWNODE点",
                        'type': "PATHNODEMOVE",
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }]
                }
                ctrlAndTplParams.propertyCtrl = appPath.road + 'ctrls/attr_node_ctrl/rwNodeCtrl';
                ctrlAndTplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_node_tpl/rwNodeTpl.html";
                $scope.type = "RWNODE";
                break;
            case "LINK":
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                toolsObj = {
                    items: [{
                        'text': "<a class='glyphicon glyphicon-plus'></a>",
                        'title': "插入形状点",
                        'type': 'PATHVERTEXINSERT',
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }, {
                        'text': "<a class='glyphicon glyphicon-remove'></a>",
                        'title': "删除形状点",
                        'type': 'PATHVERTEXREMOVE',
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }, {
                        'text': "<a class='glyphicon glyphicon-move'></a>",
                        'title': "修改形状点",
                        'type': 'PATHVERTEXMOVE',
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }, {
                        'text': "<a class='glyphicon glyphicon-transfer' type=''></a>",
                        'title': "打断link",
                        'type': 'PATHBREAK',
                        'class': "feaf",
                        callback: $scope.modifyTools
                    }]
                }
                ctrlAndTplParams.propertyCtrl = appPath.road + 'ctrls/attr_link_ctrl/rwLinkCtrl';
                ctrlAndTplParams.propertyHtml = appPath.root + appPath.road + "tpls/attr_link_tpl/rwLinkTpl.html";
                $scope.type = "RWLINK";
                break;
        }
        $scope.getFeatDataCallback(data, data.id, $scope.type, ctrlAndTplParams.propertyCtrl, ctrlAndTplParams.propertyHtml);
        if (!map.floatMenu && toolsObj) {
            map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, toolsObj)
            map.addLayer(map.floatMenu);
            map.floatMenu.setVisible(true);
        }
    };
    /********************************************************************************************/

    /**
     * 悬浮按钮的点击事件方法
     * @param event
     */
    $scope.modifyTools = function (event) {
        var type = event.currentTarget.type;//按钮的类型
        //收回上一步中弹开属性框和tips框
        $scope.$emit("SWITCHCONTAINERSTATE",
            {
                "attrContainerTpl": false,
                "subAttrContainerTpl": false
            })
        $scope.$apply();
        $("#popoverTips").hide();

        //停止shapeCtrl
        if (shapeCtrl.getCurrentTool()['options']) {
            shapeCtrl.stopEditing();
        }
        var feature = null;
        if (map.currentTool) {
            map.currentTool.disable();
        }
        if (shapeCtrl.shapeEditorResult) {
            if (tooltipsCtrl.getCurrentTooltip()) {
                tooltipsCtrl.onRemoveTooltip();
            }
            if (type === "PATHVERTEXINSERT") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setEditEventType('insertDot');
                    tooltipsCtrl.setCurrentTooltip('开始插入形状点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('正要插入形状点,先选择线！');
                    return;
                }
            } else if (type === "PATHVERTEXREMOVE") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setEditEventType('deleteDot');
                    tooltipsCtrl.setCurrentTooltip('删除此形状点！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('正要删除形状点,先选择线！');
                    return;
                }
            } else if (type === "PATHVERTEXMOVE") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setEditEventType('moveDot');
                    tooltipsCtrl.setCurrentTooltip('拖拽修改形状点位置！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('正要移动形状点先选择线！');
                    return;
                }
            } else if (type === "PATHBREAK") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setEditEventType('pathBreak');
                    tooltipsCtrl.setCurrentTooltip('开始打断link！');

                } else {
                    tooltipsCtrl.setCurrentTooltip('正要开始打断link,先选择线！');
                    return;
                }
            } else if (type === "PATHNODEMOVE") {
                if (selectCtrl.selectedFeatures) {
                    tooltipsCtrl.setEditEventType('pathNodeMove');
                    tooltipsCtrl.setCurrentTooltip('开始移动node！');
                } else {
                    tooltipsCtrl.setCurrentTooltip('正要开始移动node,先选择node！');
                    return;
                }
            }
            if (!selectCtrl.selectedFeatures) {
                return;
            }

            feature = selectCtrl.selectedFeatures.geometry;//获取要编辑的几何体的geometry
            layerCtrl.pushLayerFront('edit'); //使编辑图层置顶
            var sObj = shapeCtrl.shapeEditorResult;
            editLayer.drawGeometry = feature;
            editLayer.draw(feature, editLayer);//在编辑图层中画出需要编辑的几何体
            sObj.setOriginalGeometry(feature);
            sObj.setFinalGeometry(feature);

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]);//设置编辑的类型
            shapeCtrl.startEditing();// 开始编辑
            map.currentTool = shapeCtrl.getCurrentTool();
            if (type === "ADADMINMOVE") {
                shapeCtrl.editFeatType = "adAdmin";
                map.currentTool.snapHandler.addGuideLayer(adAdmin);//把点图层放到捕捉工具中
            } else {
                shapeCtrl.editFeatType = "adLink";
                map.currentTool.snapHandler.addGuideLayer(adLink); //把线图层放到捕捉工具中
            }
        }
    }

    $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl) {

        dsRoad.getRdObjectById(id,type,selectedData.detailId).then(function (data){
            if (data.errcode === -1) {
                return;
            }
            objCtrl.setCurrentObject(type, data.data);
            tooltipsCtrl.onRemoveTooltip();
            var options = {
                "loadType": 'attrTplContainer',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            }
            $scope.$emit("transitCtrlAndTpl", options);
        });
    }


}])