/**
 * Created by liwanchong on 2015/10/10.
 */
var errorCheckModule = angular.module('mapApp');
errorCheckModule.controller('errorCheckController', function ($scope, $timeout) {
    //属性编辑ctrl(解析对比各个数据类型)
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    //检查数据ctrl(可以监听到检查数据变化)
    var checkResultC=fastmap.uikit.CheckResultController();
    //事件ctrl
    var eventController = fastmap.uikit.EventController();
    //高亮ctrl
    var highRenderCtrl = fastmap.uikit.HighRenderController();
   // $scope.itemsByPage = 1;
    $scope.initType = 0;

    //获取检查结果数据
    if(checkResultC.errorCheckData){
        $scope.rowCollection=checkResultC.errorCheckData;
    }

    //状态
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    //修改状态
    $scope.changeType = function (selectInd, rowid) {
        var params = {
            "projectId": Application.projectid,
            "id": rowid,
            "type": selectInd
        };
        Application.functions.updateCheckType(JSON.stringify(params), function (data) {
            if (data.errcode == 0) {
                $scope.$apply();
                $scope.getCheckDateAndCount();
            }
        });
    }


    //点击数据在地图上高亮
    $scope.showOnMap = function (targets) {
        highRenderCtrl._cleanHighLight();
        if(highRenderCtrl.highLightFeatures!=undefined){
            highRenderCtrl.highLightFeatures.length = 0;
        }
        var value = targets.replace("[", "");
        var value1 = value.replace("]", "");

        var type = value1.split(",")[0].replace("_", "");
        var id = value1.split(",")[1];
        //线高亮
        if (type == "RDLINK") {
            Application.functions.getRdObjectById(id, type, function (d) {
                if (d.errcode === -1) {
                    return;
                }
                var highlightFeatures = [];
                var linkArr = d.data.geometry.coordinates || d.geometry.coordinates, points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = L.latLng(linkArr[i][1], linkArr[i][0]);
                    points.push(point);
                }
                var line = new L.polyline(points);
                var bounds = line.getBounds();
                map.fitBounds(bounds, {"maxZoom": 19});

                highlightFeatures.push({
                    id:id.toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                });
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();

            })
        } else if (type == "RDRESTRICTION") {//交限高亮

            var limitPicArr = [];
            layerCtrl.pushLayerFront('referencePoint');
            Application.functions.getRdObjectById(id, type, function (d) {
                objCtrl.setCurrentObject("RDRESTRICTION", d.data);

                ////高亮进入线和退出线
                var hightlightFeatures = [];
                hightlightFeatures.push({
                    id: d.data.pid.toString(),
                    layerid:'restriction',
                    type:'restriction',
                    style:{}
                })
                hightlightFeatures.push({
                    id: objCtrl.data["inLinkPid"].toString(),
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                })

                for (var i = 0, len = (objCtrl.data.details).length; i < len; i++) {

                    hightlightFeatures.push({
                        id: objCtrl.data.details[i].outLinkPid.toString(),
                        layerid:'referenceLine',
                        type:'line',
                        style:{}
                    })
                }
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
            })
        } else {//其他tips高亮
            layerCtrl.pushLayerFront("workPoint");
            Application.functions.getTipsResult(id, function (data) {
                map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);

                var highlightFeatures=[];
                highlightFeatures.push({
                    id:data.rowkey,
                    layerid:'workPoint',
                    type:'workPoint',
                    style:{}
                });
                highRenderCtrl.highLightFeatures = highlightFeatures;
                highRenderCtrl.drawHighlight();
            });
        }
    }


    //监听检查结果并获取
    eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });
});