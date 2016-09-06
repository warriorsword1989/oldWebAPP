/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("app");
oridinaryInfoApp.controller("oridinaryCarController",['$scope','dsEdit',function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    $scope.realtimeData = objCtrl.data;

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

    for(var i= 0,len=$scope.realtimeData.rtics.length;i<len;i++) {
        if($scope.realtimeData.rtics[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
            $scope.oridiData = $scope.realtimeData.rtics[i];
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
    };


    //添加新的RTIC代码
    $scope.addRticCode=function(){
        dsEdit.applyPid("rtic").then(function (data) {
            $scope.oridiData.code=data.data;
        });
    };
//回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if($scope.ordinaryCarForm) {
        $scope.ordinaryCarForm.$setPristine();
    }
    $scope.$on('refreshPage',function(data){
        $scope.realtimeData = objCtrl.data;
        for(var i= 0,len=$scope.realtimeData.rtics.length;i<len;i++) {
            if($scope.realtimeData.rtics[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
                $scope.oridiData = $scope.realtimeData.rtics[i];
            }
        }
    });

}]);