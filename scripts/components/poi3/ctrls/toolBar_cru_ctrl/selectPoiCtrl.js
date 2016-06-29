/**
 * Created by liuyang on 2016/06/03.
 */
var selectAdApp = angular.module("app");
selectAdApp.controller("selectPoiController", ["$scope", '$ocLazyLoad', '$rootScope','appPath','dsEdit', function ($scope, $ocLazyLoad, $rootScope,appPath,dsEdit) {
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var editLayer = layerCtrl.getLayerById('edit');
    var poi = layerCtrl.getLayerById('poiPoint');
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var originalFeature = [];
    var selectCount = 0;
    var popup = L.popup();
     $scope.toolTipText = "";


    /*
     获取地图上的指定图层
     */
    $scope.getLayerById = function(layerId) {
        var layer;
        for (var item in map._layers) {
            if (map._layers[item].options.id) {
                if (map._layers[item].options.id === layerId) {
                    layer=map._layers[item];
                    break;
                }
            }
        }
        return layer;
    }

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
    /**
     * 查找poi
     */
    $scope.getPoi = function (pid) {
        dsEdit.getByPid(pid, "IXPOI").then(function (rest) {
            if (rest) {
                objCtrl.setCurrentObject('IXPOI', rest);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                $scope.$emit("SWITCHCONTAINERSTATE", {});
                $scope.$emit("transitCtrlAndTpl", {
                    "loadType": "tipsTplContainer",
                    "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                    "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                });
                $scope.$emit("transitCtrlAndTpl", {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                    "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                });
            }
        });
    };
    /*
    变更父子关系
    */
    changeParent = function (parentId) {
        var myPid = objCtrl.data.pid;
        var myParent = objCtrl.data.parents;
        if (myParent.length > 0) {
            if (myParent[0].parentPoiPid == parentId) {//解除
                dsEdit.deleteParent(myPid).then(function (data) {

                });
            } else {//更新
                dsEdit.updateParent(myPid, parentId).then(function (data) {

                });
            }
        } else {//新增
            dsEdit.createParent(myPid, parentId).then(function (data) {

            });
        }
        map.closePopup();
        $scope.clearMap();
        var drawLayer = $scope.getLayerById('parentLayer');
        if(drawLayer!=undefined){
            map.removeLayer(drawLayer);
        }
        $scope.getPoi(myPid);
    };

    /**
     * 点击悬浮按钮方法
     * @param event
     */
    $scope.modifyTools = function (event) {
        var type = event.currentTarget.type;//按钮的类型
        if (type === "POILOCMOVE") {
            if (selectCtrl.selectedFeatures) {
                tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
            } else {
                tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                return;
            }
        } else if (type === "POIGUIDEMOVE") {
            if (selectCtrl.selectedFeatures) {
                tooltipsCtrl.setCurrentTooltip('开始移动POI引导坐标点！');
            } else {
                tooltipsCtrl.setCurrentTooltip('先选择POI引导坐标点！');
                return;
            }
        } else if(type === "POIAUTODRAG"){
            if (selectCtrl.selectedFeatures) {
                tooltipsCtrl.setCurrentTooltip('开始移动POI显示坐标点！');
            } else {
                tooltipsCtrl.setCurrentTooltip('先选择POI显示坐标点！');
                return;
            }
        } else if(type === "POIRESET"){
            if(shapeCtrl.shapeEditorResult){
                var sObj = shapeCtrl.shapeEditorResult;
                var oFeature = sObj.getOriginalGeometry();
                var of_1 = originalFeature[0].clone();
                var of_2 = originalFeature[1].clone();
                var comsAndPoints = [];
                comsAndPoints.push(of_1);
                comsAndPoints.push(of_2);
                oFeature.components = comsAndPoints;
                oFeature.points = comsAndPoints;
                setTimeout(function () {
                    editLayer.clear();
                    $scope.geometry = of_1;
                    $scope.guide = of_2;
                    editLayer.draw(oFeature, editLayer);//在编辑图层中画出需要编辑的几何体
                },100);
                map.currentTool = shapeCtrl.getCurrentTool();
                shapeCtrl.shapeEditorResult.setFinalGeometry(oFeature);
                return;
            }
        } else if (type ==="SELECTPARENT"){
            tooltipsCtrl.setCurrentTooltip('请框选地图上的POI点！');
            eventController.on(eventController.eventTypes.GETBOXDATA, function (event) {
                var data = event.data, highlightFeatures = [],
                    rectangleData = {       //矩形框信息geoJson
                        "type": "Polygon",
                        "coordinates": [[]]
                    },
                    latArr = event.border._latlngs;
                /*过滤框选后的数组，去重*/
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data.length; j++) {
                        if(i!=j){
                            if (data[i].properties.id == data[j].properties.id || data[i].properties.id == objCtrl.data.pid) {
                                data.splice(i, 1);
                            }
                        }
                    }
                }
                for (var rec = 0; rec < latArr.length; rec++) {
                    var tempArr = [];
                    tempArr.push(latArr[rec].lng);
                    tempArr.push(latArr[rec].lat);
                    rectangleData.coordinates[0].push(tempArr);
                    if (rec == latArr.length - 1) {
                        rectangleData.coordinates[0].push(rectangleData.coordinates[0][0]);
                    }
                }
                /*高亮link*/
                for (var i = 0, lenI = data.length; i < lenI; i++) {
                    highlightFeatures.push({
                        id: data[i].properties.id.toString(),
                        layerid:'poiPoint',
                        type:'poi'
                    })
                }
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();

                //判断相交点数
                if (data.length == 0) {
                    tooltipsCtrl.setCurrentTooltip('所选区域无POI点，请重新选择！');
                }else {
                    var html = '<ul id="layerpopup">';
                    //this.overlays = this.unique(this.overlays);
                    for (var item in data) {
                        var index = parseInt(item) + 1;
                        if(objCtrl.data.parents.length>0 && data[item].properties.id == objCtrl.data.parents[0].parentPoiPid){//当前父
                            html += '<li><a href="#" id="' + data[item].properties.id+'">'+ index + '、' + data[item].properties.name + '</a>' + '&nbsp;&nbsp;'+ '<label class="label label-primary">'+ $scope.metaData.kindFormat[data[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;'+ '<label class="label label-default">'+ '当前父'+ '</label>' + '&nbsp;&nbsp;'+ '<input class="btn btn-warning btn-xs" type="button" onclick="changeParent('+data[item].properties.id+')" value="解除父">' +  '</li>';
                        } else if($scope.metaData.kindFormat[data[item].properties.kindCode].parent != 0){
                            html += '<li><a href="#" id="' + data[item].properties.id+'">'+ index + '、' + data[item].properties.name + '</a>'+ '&nbsp;&nbsp;'+ '<label class="label label-primary">'+ $scope.metaData.kindFormat[data[item].properties.kindCode].kindName + '</label>' + '&nbsp;&nbsp;'+ '<label class="label label-info">'+ '可为父'+ '</label>' + '&nbsp;&nbsp;'+ '<input class="btn btn-success btn-xs" type="button" onclick="changeParent('+data[item].properties.id+')" value="作为父">' +  '</li>';
                        }
                        // html += '<li><a href="#" id="' + data[item].properties.id+'">'+ index + '、' +data[item].properties.name + '<label class="label label-primary">'+$scope.metaData.kindFormat[data[item].properties.kindCode].kindName+'</label>'+ '<input type="button">' + '</a></li>';
                    }
                    html += '</ul>';
                    popup
                        .setLatLng([data[item].point.y,data[item].point.x])
                        .setContent(html);
                    if (data && data.length >= 1) {
                        setTimeout(function () {
                            map.openPopup(popup);
                        }, 200)
                    }


                }
            });
        }

        if (!selectCtrl.selectedFeatures) {
            return;
        }
        if(!selectCount){
            // $scope.$apply();
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
                feature = selectCtrl.selectedFeatures.geometry;//获取要编辑的几何体的geometry
                //组装一个线
                feature.components = [];
                feature.points = [];
                feature.components.push(feature[0]);
                feature.components.push(feature[1]);
                feature.points.push(feature[0]);
                feature.points.push(feature[1]);
                originalFeature.push(feature[0].clone());
                originalFeature.push(feature[1].clone());
                feature.type = "Poi";

                layerCtrl.pushLayerFront('edit'); //使编辑图层置顶
                var sObj = shapeCtrl.shapeEditorResult;
                editLayer.drawGeometry = feature;
                editLayer.draw(feature, editLayer);//在编辑图层中画出需要编辑的几何体
                sObj.setOriginalGeometry(feature);
                sObj.setFinalGeometry(feature);

                selectCount = 1;
            }
        }
        shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType[type]);//设置编辑的类型
        shapeCtrl.startEditing();// 开始编辑
        map.currentTool = shapeCtrl.getCurrentTool();
        if (type === "POILOCMOVE") {
            shapeCtrl.editFeatType = "poi";
            map.currentTool.snapHandler._guides.length = 0;
            map.currentTool.snapHandler.addGuideLayer(poi);//把点图层放到捕捉工具中
        } else if(type === "POIGUIDEMOVE"){
            shapeCtrl.editFeatType = "poiGuide";
            map.currentTool.snapHandler._guides.length = 0;
            map.currentTool.snapHandler.addGuideLayer(rdLink); //把线图层放到捕捉工具中
        } else if(type === "POIAUTODRAG"){
            shapeCtrl.editFeatType = "poi";
            map.currentTool.snapHandler._guides.length = 0;
            map.currentTool.snapHandler.addGuideLayer(rdLink); //把线图层放到捕捉工具中
        } else if(type === "POIRESET"){
            map.currentTool.snapHandler._guides.length = 0;
        } else if (type === "SELECTPARENT"){
            map.currentTool.snapHandler._guides.length = 0;
        }
    };

    /*
     * 点击选择poi按钮
     * */
    $scope.selectPoiShape = function (type, num) {
        if (map.getZoom() < 17) {
            return;
        }
        map.closePopup();//如果有popup的话清除它
        //重置选择工具
        $scope.resetToolAndMap();

        //移除上一步中的悬浮按钮
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        //重置上一步中的属性栏和tips框
        originalFeature = [];
        selectCount = 0;

        $scope.changeBtnClass(num);

        //连续点击选择按钮的操作
        if (!$scope.classArr[num]) {
            map.currentTool.disable();
            map._container.style.cursor = '';
            return;
        }
        if (type === "poi") {
            layerCtrl.pushLayerFront('edit');//把editlayer置顶

            //初始化选择POI点工具
            map.currentTool = new fastmap.uikit.SelectPoi({
                map: map,
                nodesFlag: true,
                currentEditLayer: poi,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();

            //把点图层加到捕捉工具中
            map.currentTool.snapHandler.addGuideLayer(poi);
            //初始化鼠标提示
            $scope.toolTipText = '请选择POI点！';
            eventController.off(eventController.eventTypes.GETPOIID, $scope.selectObjCallback);
            eventController.on(eventController.eventTypes.GETPOIID, $scope.selectObjCallback);
        }
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
    };

    /**
     * 初始化数据
     */
    $scope.initializeData = function(){
        var locArr =objCtrl.data.geometry.coordinates;
        var guideArr =objCtrl.data.guide.coordinates;
        var points = [];
        points.push(fastmap.mapApi.point(locArr[0], locArr[1]));
        points.push(fastmap.mapApi.point(guideArr[0], guideArr[1]));
        selectCtrl.onSelected({//记录选中点信息
            geometry: points,
            id: objCtrl.data.pid,
            linkPid:objCtrl.data.linkPid
        });

        //高亮POI点
        var highLightFeatures=[];
        highLightFeatures.push({
            id:objCtrl.data.pid.toString(),
            layerid:'poiPoint',
            type:'poi'
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    };

    /**
     * poi点击事件方法
     * 传给父页面，判断下当前poi是否发生改变，然后父页面将结果再反馈回来，执行点击操作
     * @param data
     */
    // $scope.selectObjCallback = function (data) {
    //     var listener;
    //     listener = $scope.$on("changeDataRes",function (event) {
    //         $scope.selectPoi(data);
    //         if(listener){
    //             listener();
    //         }
    //     });
    //     $scope.$emit("changeData");
    // };

    $scope.selectObjCallback = function (data) {
        dsEdit.getByPid(data.id, "IXPOI").then(function(rest) {
            if (rest) {
                objCtrl.setCurrentObject('IXPOI', rest);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                $scope.$emit("transitCtrlAndTpl", {
                    "loadType": "tipsTplContainer",
                    "propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
                    "propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
                });
                $scope.$emit("transitCtrlAndTpl", {
                    "loadType": "attrTplContainer",
                    "propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
                    "propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
                });
                $scope.$emit("highLightPoi", rest.pid);

                map.closePopup();//如果有popup的话清除它
                //移除上一步中的悬浮按钮
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                var toolsObj = null;
                $scope.type = null;
                switch (data.optype) {
                    case "POIPOINT" :
                        toolsObj = {
                            items: [{
                                'text': "<a class='glyphicon glyphicon-open'></a>",
                                'title': "移动显示坐标",
                                'type': "POILOCMOVE",
                                'class': "feaf",
                                callback: $scope.modifyTools
                            },
                                {
                                    'text': "<a class='glyphicon glyphicon-export'></a>",
                                    'title': "移动引导坐标",
                                    'type': "POIGUIDEMOVE",
                                    'class': "feaf",
                                    callback: $scope.modifyTools
                                },
                                {
                                    'text': "<a class='glyphicon glyphicon-random'></a>",
                                    'title': "引导坐标随着显示坐标变化",
                                    'type': "POIAUTODRAG",
                                    'class': "feaf",
                                    callback: $scope.modifyTools
                                },
                                {
                                    'text': "<a class='glyphicon glyphicon-refresh'></a>",
                                    'title': "重置",
                                    'type': "POIRESET",
                                    'class': "feaf",
                                    callback: $scope.modifyTools
                                },
                                {
                                    'text': "<a class='glyphicon glyphicon-cloud-upload'></a>",
                                    'title': "编辑父",
                                    'type': "SELECTPARENT",
                                    'class': "feaf",
                                    callback: $scope.modifyTools
                                }]
                        };
                        $scope.type = "POI";
                        break;
                }
                $scope.initializeData();
                map.currentTool.enable();
                tooltipsCtrl.onRemoveTooltip();
                if (!map.floatMenu && toolsObj) {
                    map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, toolsObj);
                    map.addLayer(map.floatMenu);
                    map.floatMenu.setVisible(true);
                }
            }
        });
    };

    $scope.clearMap = function () {
        //重置选择工具
        $scope.resetToolAndMap();
        //移除上一步中的悬浮按钮
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        $scope.classArr[0] = false;
        //重置上一步中的属性栏和tips框
        originalFeature = [];
        selectCount = 0;
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
    };

    //高亮显示指定的poi
    $scope.$on("highlightPoiInMap",function (event,pid,geometry) {
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        var highLightFeatures = [];
        highLightFeatures.push({
            id:pid,
            layerid:'poiPoint',
            type:'poi',
            style:{}
        });
        //高亮
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        map.setView([geometry.coordinates[1], geometry.coordinates[0]], 20);
    });

    //高亮显示左侧列表的poi
    $scope.$on("highlightPoiByPid",function (event) {
        var pid = objCtrl.data.pid;
        $scope.clearMap();
        var highLightFeatures = [];
        highLightFeatures.push({
            id:pid,
            layerid:'poiPoint',
            type:'poi',
            style:{}
        });
        //高亮
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        map.setView([objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]], 20);
    });

}]);