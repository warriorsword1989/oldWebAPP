/**
 * Created by liuyang on 2016/06/03.
 */
var selectAdApp = angular.module("app");
selectAdApp.controller("selectPoiController", ["$scope", '$ocLazyLoad', '$rootScope', function ($scope, $ocLazyLoad, $rootScope) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
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
     * 悬浮按钮的点击事件方法
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
                    editLayer.draw(oFeature, editLayer);//在编辑图层中画出需要编辑的几何体
                },100);
                map.currentTool = shapeCtrl.getCurrentTool();
                shapeCtrl.shapeEditorResult.setFinalGeometry(oFeature);
                return;
            }
        }
        if (!selectCtrl.selectedFeatures) {
            return;
        }
        if(!selectCount){
            //收回上一步中弹开属性框和tips框
            $scope.$emit("SWITCHCONTAINERSTATE",
                {
                    "attrContainerTpl": false,
                    "subAttrContainerTpl": false
                });
            $scope.$apply();
            //停止shapeCtrl
            if (shapeCtrl.getCurrentTool()['options']) {
                shapeCtrl.stopEditing();
            }
            var feature = null,feature1 = null,feature2 = null;
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
                // delete feature.x;
                // delete feature.y;
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
    $scope.selectPoiShape = function (type, num) {
        //重置选择工具
        $scope.resetToolAndMap();

        //移除上一步中的悬浮按钮
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        //重置上一步中的属性栏和tips框
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
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
        $scope.PoiData = objCtrl.data;//获取数据
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());//记录原始数据值
        // var points = fastmap.mapApi.point($scope.PoiData.location.longitude, $scope.PoiData.location.latitude);
        var locArr =$scope.PoiData.geometry.coordinates;
        var guideArr =$scope.PoiData.guide.coordinates;
        var points = [];
        points.push(fastmap.mapApi.point(locArr[0], locArr[1]));
        points.push(fastmap.mapApi.point(guideArr[0], guideArr[1]));
        selectCtrl.onSelected({//记录选中点信息
            geometry: points,
            id: $scope.PoiData.pid
        });

        //高亮POI点
        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.PoiData.pid.toString(),
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

    $scope.selectObjCallback = function (data) {
        //移除上一步中的悬浮按钮
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.highLightFeatures.length = 0;
        var ctrlAndTplParams = {
            propertyCtrl: "",
            propertyHtml: ""
        }, toolsObj = null;
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
                        }]
                };
                ctrlAndTplParams.propertyCtrl = 'scripts/components/poi-new/ctrls/attr-base/generalBaseCtl';
                ctrlAndTplParams.propertyHtml = "../../../scripts/components/poi-new/tpls/attr-base/generalBaseTpl.html";
                $scope.type = "POI";
                break;
        }
        //poi的时候要这样用
        // objCtrl.setCurrentObject("POI", $scope.poi);
        // tooltipsCtrl.onRemoveTooltip();
        // var options = {
        //     "loadType": 'attrTplContainer',
        //     "propertyCtrl": ctrlAndTplParams.propertyCtrl,
        //     "propertyHtml": ctrlAndTplParams.propertyHtml
        // };
        // $scope.$emit("transitCtrlAndTpl", options);


        $scope.getRdObjectById=function(id,type,func,detailid) {
            if(!id){
                fastmap.mapApi.ajaxConstruct(App.Config.generalUrl+App.Config.editServer+'/getByPid?parameter={"projectId":'+App.Temp.projectId+',"type":"'+type+'","detailId":'+detailid+'}',
                    function(data) {
                        func(data);
                    });
            }else{
                fastmap.mapApi.ajaxConstruct(App.Config.generalUrl+App.Config.editServer+'/getByPid?parameter={"projectId":'+App.Temp.projectId+',"type":"'+type+'","pid":'+id+'}',
                    function(data) {
                        func(data);
                    });
            }

        };
        $scope.getFeatDataCallback = function (selectedData, id, type, ctrl, tpl) {
            $scope.getRdObjectById(id, "ADADMIN", function (data) {
                if (data.errcode === -1) {
                    return;
                }
                var guide = {};
                guide.coordinates = [];
                guide.coordinates.push(116.47654,40.01341);
                guide.type= "Point";
                data.data.guide = guide;
                objCtrl.setCurrentObject(type, data.data);
                if(objCtrl.data){
                    $scope.initializeData();
                }
                tooltipsCtrl.onRemoveTooltip();
                var options = {
                    "loadType": 'attrTplContainer',
                    "propertyCtrl": ctrl,
                    "propertyHtml": tpl
                };
                $scope.$emit("transitCtrlAndTpl", options);
            }, selectedData.detailid);
        };
        $scope.getFeatDataCallback(data, data.id, $scope.type, ctrlAndTplParams.propertyCtrl, ctrlAndTplParams.propertyHtml);

        if (!map.floatMenu && toolsObj) {
            map.floatMenu = new L.Control.FloatMenu("000", data.event.originalEvent, toolsObj);
            map.addLayer(map.floatMenu);
            map.floatMenu.setVisible(true);
        }
    };

    //高亮显示指定的子poi
    $scope.$on("highlightPoiByPid",function (event,pid) {
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
        map.setView([$scope.poi.geometry.coordinates[1], $scope.poi.geometry.coordinates[0]], 20);
    });

}]);