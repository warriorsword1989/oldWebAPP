/**
 * 其他属性中的普通限速
 * Created by liwanchong on 2016/3/3.
 */
var oridinarySpeedApp = angular.module("mapApp");
oridinarySpeedApp.controller("ordinarySpeedController", function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    $scope.speedAndDirect=shapeCtrl.shapeEditorResult.getFinalGeometry();
    $scope.speedLimitsData = objCtrl.data.speedlimits;
    $scope.roadlinkData = objCtrl.data;


    for(var i= 0,len=$scope.speedLimitsData.length;i<len;i++) {
        if($scope.speedLimitsData[i]["rowId"]===$scope.roadlinkData["oridiRowId"]) {
            $scope.oridiData = $scope.speedLimitsData[i];
        }
    }

    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            if($scope.ordinarySpeedForm!=undefined) {
                $scope.ordinarySpeedForm.$setPristine();
            }
        });
    }
    $scope.speedTypeOption=[
        {"id":0,"label":"普通"},
        {"id":1,"label":"指示牌"},
        {"id":3,"label":"特定条件"}
    ];
    $scope.fromLimitSrcOption=[
        {"id":0,"label":"未赋值"},
        {"id":1,"label":"现场标牌"},
        {"id":2,"label":"城区标识"},
        {"id":3,"label":"高速标识"},
        {"id":4,"label":"车道限速"},
        {"id":5,"label":"方向限速"},
        {"id":6,"label":"机动车限速"},
        {"id":7,"label":"匝道未调查"},
        {"id":8,"label":"缓速行驶"},
        {"id":9,"label":"未调查"}
    ];

    $scope.speedDependentOption = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.speedAndDirect=function(data,index) {
            if(data.orientation==="2") {
                var fromSpeed = document.getElementById("fromSpeed");
                fromSpeed.focus();
            }else if(data.orientation==="1") {
                var toSpeed = document.getElementById("toSpeed");
                toSpeed.focus()
            }


    };

    $scope.angleOfLink=function(pointA,pointB) {
        var PI = Math.PI,angle;
        if((pointA.x-pointB.x)===0) {
            angle = PI / 2;
        }else{
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;

    };
    $scope.changeSpeedAndDirect=function(direct,index) {
        if(direct==3){
            direct=1;
        }
        map.currentTool.disable();
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var point= {x:$scope.roadlinkData.geometry.coordinates[0][0], y:$scope.roadlinkData.geometry.coordinates[0][1]};
        var pointVertex= {x:$scope.roadlinkData.geometry.coordinates[1][0], y:$scope.roadlinkData.geometry.coordinates[1][1]};
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag:true,
            pid:$scope.roadlinkData.pid,
            point: point,
            type: "intRticMarker",
            angle:angle,
            orientation:direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sobj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry =  marker;
        editLayer.draw( marker, editLayer);
        sobj.setOriginalGeometry( marker);
        sobj.setFinalGeometry(marker);
        shapeCtrl.setEditingType("transformDirect");
        shapeCtrl.startEditing();
        eventController.on(eventController.eventTypes.DIRECTEVENT,function(event){
            $scope.speedAndDirect(event.geometry,index);
        })

    };


 /*   $scope.angleOfLink=function(pointA,pointB) {
        var PI = Math.PI,angle;
        if((pointA.x-pointB.x)===0) {
            angle = PI / 2;
        }else{
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;

    };
    $scope.changeDirect = function (direct) {
        map.currentTool.disable();
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var endNum = parseInt($scope.realtimeData.geometry.coordinates.length / 2);
        var point= {x:$scope.realtimeData.geometry.coordinates[0][0], y:$scope.realtimeData.geometry.coordinates[0][1]};
        var pointVertex= {x:$scope.realtimeData.geometry.coordinates[endNum][0], y:$scope.realtimeData.geometry.coordinates[endNum][1]};
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag:true,
            pid:$scope.realtimeData.pid,
            point: point,
            type: "marker",
            angle:angle,
            orientation:direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sObj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry =  marker;
        editLayer.draw( marker, editLayer);
        sObj.setOriginalGeometry( marker);
        sObj.setFinalGeometry(marker);
        shapeCtrl.setEditingType("transformDirect");
      //  shapeCtrl.startEditing();
    };*/
})