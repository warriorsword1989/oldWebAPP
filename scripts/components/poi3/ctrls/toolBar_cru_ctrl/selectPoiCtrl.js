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
        } else if (type ==="PARENTRALATION"){
            tooltipsCtrl.setEditEventType('parentRalation');
            tooltipsCtrl.setCurrentTooltip('正要新建立交,请框选立交点位！');
            shapeCtrl.selectParents("selectParent", {
                map: map,
                layer: poi,
                type: "rectangle"
            });
            map.currentTool = shapeCtrl.getCurrentTool();
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
                        if (i != j && data[i]) {
                            if (data[i].data.properties.id == data[j].data.properties.id) {
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
                        id: data[i].data.properties.id.toString(),
                        layerid: 'referenceLine',
                        type: 'RDGSC',
                        index: i,
                        style: {
                            size: 5
                        }
                    })
                }
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
                /*运算两条线的交点坐标*/
                $scope.segmentsIntr = function (a, b) {    //([{x:_,y:_},{x:_,y:_}],[{x:_,y:_},{x:_,y:_}]) a,b为两条直线
                    var area_abc = (a[0].x - b[0].x) * (a[1].y - b[0].y) - (a[0].y - b[0].y) * (a[1].x - b[0].x);
                    var area_abd = (a[0].x - b[1].x) * (a[1].y - b[1].y) - (a[0].y - b[1].y) * (a[1].x - b[1].x);
                    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
                    if (area_abc * area_abd >= 0) {
                        return false;
                    }

                    var area_cda = (b[0].x - a[0].x) * (b[1].y - a[0].y) - (b[0].y - a[0].y) * (b[1].x - a[0].x);
                    var area_cdb = area_cda + area_abc - area_abd;
                    if (area_cda * area_cdb >= 0) {
                        return false;
                    }

                    //计算交点坐标
                    var t = area_cda / ( area_abd - area_abc );
                    var dx = t * (a[1].x - a[0].x),
                        dy = t * (a[1].y - a[0].y);
                    return {x: (a[0].x + dx).toFixed(5), y: (a[0].y + dy).toFixed(5)};//保留小数点后5位
                }
                /*去除重复的坐标点，保留一个*/
                var ArrUnique = function (arr) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = 0; j < arr.length; j++) {
                            if (i != j) {
                                if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
                                    arr.splice(j, 1);
                                }
                            }
                        }
                    }
                    /*清除空数组*/
                    arr.filter(function (v) {
                        if (v.length > 0) {
                            return v;
                        }
                    })
                    return arr;
                }
                /*当坐标数组拆分组合完成后*/
                var crossGeos = [],
                    loopTime = (data.length * data.length - 1) / 2,   //循环次数C(n,2)
                    jsonData = {
                        'geometry': rectangleData,
                        'linkObjs': []
                    };
                if (data.length > 1) {
                    for (var i = 0; i < loopTime - 1; i++) {
                        for (var j = i + 1; j < data.length; j++) {
                            if (i != j) {
                                var lineGeoArr = function (mark) {
                                    return [data[mark].line.points[0], data[mark].line.points[1]];
                                }
                                crossGeos.push($scope.segmentsIntr(lineGeoArr(i), lineGeoArr(j)));
                            }
                        }
                    }
                    crossGeos = ArrUnique(crossGeos);
                }
                /*点击调整link层级高低*/
                $scope.changeLevel = function () {
                    editLayer.drawGeometry = null;
                    map.currentTool.options.repeatMode = false;
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                    $scope.changeBtnClass("");
                    shapeCtrl.shapeEditorResult.setFinalGeometry(null);
                    shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
                    editLayer.clear();
                    $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false});
                    map._container.style.cursor = '';
                    map.currentTool = new fastmap.uikit.SelectPath(
                        {
                            map: map,
                            currentEditLayer: rdLink,
                            linksFlag: true,
                            shapeEditor: shapeCtrl
                        });
                    map.currentTool.enable();
                    rdLink.options.selectType = 'link';
                    rdLink.options.editable = true;
                    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                        /*把当前link的level_index升高一级*/
                        for (var i = 0, lenI = jsonData.linkObjs.length; i < lenI; i++) {
                            if (jsonData.linkObjs[i].pid == data.id) {
                                for (var j = 0, lenJ = jsonData.linkObjs.length; j < lenJ; j++) {
                                    if (jsonData.linkObjs[j].level_index == jsonData.linkObjs[i].level_index + 1) {
                                        jsonData.linkObjs[j].level_index--;
                                    }
                                }
                                jsonData.linkObjs[i].level_index = +1;
                            }
                        }
                        /*重绘link颜f色*/
                        for (var i = 0; i < jsonData.linkObjs.length; i++) {
                            highlightFeatures.push({
                                id: jsonData.linkObjs[i].pid.toString(),
                                layerid: 'referenceLine',
                                type: 'RDGSC',
                                index: jsonData.linkObjs[i].level_index,
                                style: {
                                    size: 5
                                }
                            });
                            highRenderCtrl.highLightFeatures = highlightFeatures;
                            highRenderCtrl.drawHighlight();
                        }
                    })
                }
                //判断相交点数
                if (crossGeos.length == 0) {
                    tooltipsCtrl.setCurrentTooltip('所选区域无相交点，请重新选择立交点位！');
                } else if (crossGeos.length > 1) {
                    tooltipsCtrl.setCurrentTooltip('不能有多个相交点，请重新选择立交点位！');
                } else {
                    //map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                    /*重组linkData格式*/
                    for (var linkMark = 0; linkMark < data.length; linkMark++) {
                        var tempObj = {'pid': data[linkMark].data.properties.id, 'level_index': linkMark};
                        jsonData.linkObjs.push(tempObj);
                    }
                    tooltipsCtrl.setCurrentTooltip("点击link调整层级,空格保存,或者按ESC键取消!");
                    $scope.changeLevel();
                    selectCtrl.onSelected(jsonData);
                }
            });



        }
        if (!selectCtrl.selectedFeatures) {
            return;
        }
        if(!selectCount){
            $scope.$apply();
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
        originalFeature = []
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
        if($scope.adAdminForm) {
            $scope.adAdminForm.$setPristine();
        }
    };

    /**
     * poi点击事件方法
     * 传给父页面，判断下当前poi是否发生改变，然后父页面将结果再反馈回来，执行点击操作
     * @param data
     */
    $scope.selectObjCallback = function (data) {
        var listener;
        listener = $scope.$on("changeDataRes",function (event) {
            $scope.selectPoi(data);
            if(listener){
                listener();
            }
        });
        $scope.$emit("changeData");
    };
    // $scope.selectPoiCallback = function (data) {
    //     var liser;
    //     liser =  $scope.$on("getObjectByIdRes",function (event) {
    //         $scope.selectPoi(data);//确保父页面查询到poi数据
    //         if(liser){
    //             liser();
    //         }
    //     });
    //     $scope.$emit("getObjectById",{pid:data.id,type:"IXPOI"});
    //
    // };

    $scope.selectPoi = function (data) {
        dsEdit.getByPid(data.id, "IXPOI").then(function(rest) {
            if (rest) {
                objCtrl.setCurrentObject('IXPOI', rest);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {
                    feature: objCtrl.data
                });
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
                                    'type': "PARENTRALATION",
                                    'class': "feaf",
                                    callback: $scope.modifyTools
                                }]
                        };
                        $scope.type = "POI";
                        break;
                }
                $scope.initializeData();
                tooltipsCtrl.onRemoveTooltip();
                if (!map.floatMenu && toolsObj) {
                    map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, toolsObj);
                    map.addLayer(map.floatMenu);
                    map.floatMenu.setVisible(true);
                }
            }
        });

    }

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