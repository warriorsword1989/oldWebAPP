/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("mapApp");
oridinaryInfoApp.controller("oridinaryRticsController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    $scope.realtimeData = objCtrl.data;

    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            $scope.ordinaryRticForm.$setPristine();
        });
    }
    $scope.rticDroption =[
        {"id": 0,"label":"无"},
        {"id": 1,"label":"顺方向"},
        {"id": 2,"label":"逆方向"}
    ];
    $scope.rankoption=[
        {"id": 0,"label":"无"},
        {"id": 1,"label":"高速"},
        {"id": 2,"label":"城市高速"},
        {"id": 3,"label":"干线道路"},
        {"id": 4,"label":"其他道路"}
    ];

    for(var i= 0,len=$scope.realtimeData.intRtics.length;i<len;i++) {
        if($scope.realtimeData.intRtics[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
            $scope.oridiData = $scope.realtimeData.intRtics[i];
            $scope.rank= $scope.oridiData.rank;

            for (var layer in layerCtrl.layers) {
                if (layerCtrl.layers[layer].options.requestType === "RDLINKINTRTIC") {
                    $scope.isupDirect=layerCtrl.layers[layer].options.isUpDirect;
                }
            }
            if($scope.oridiData.rank==0){
                swal("", "RTIC等级不能为无，请选择RTIC等级", "");
            }
        }
    }



    $scope.changeRank=function(){
        if($scope.oridiData.rank==0){
            swal("", "RTIC等级不能为无，请选择RTIC等级", "");
        }else if($scope.rank!=1&&$scope.oridiData.rank==1){
            swal("", "RTIC等级不能正确，请选择RTIC等级", "");
        }
    }

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
            type: "intRticMarker",
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
        shapeCtrl.startEditing();
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

    if($scope.realtimeData.direct!=1){
        if($scope.oridiData) {
            if($scope.realtimeData.direct==3){
                $scope.oridiData.rticDr = 2;
                $scope.changeDirect(2);
            }else if($scope.realtimeData.direct==2){
                $scope.oridiData.rticDr = 1;
                $scope.changeDirect(1);
            }

        }

    }else{
        if($scope.oridiData){
            $scope.oridiData.rticDr=1;
            $scope.changeDirect(1);
        }

    }

    //添加新的RTIC代码
    $scope.addRticCode=function(){
        var param = {
            "type": "rtic"
        };
        Application.functions.getIntRticRank(JSON.stringify(param), function (data) {
            if (data.errcode == 0) {
                $scope.oridiData.code=data.data;
                $scope.$apply();
            }
        });
    }


})