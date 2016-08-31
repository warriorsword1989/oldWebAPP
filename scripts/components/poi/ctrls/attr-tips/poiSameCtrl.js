/**
 * Created by liuyang on 2016/8/30.
 */
var samePoiApp = angular.module("app",[]);
samePoiApp.controller("SamePoiController",['$scope','$ocLazyLoad','appPath','dsEdit','$timeout',function($scope,$ocLazyLoad,appPath,dsEdit,$timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var layerCtrl = fastmap.uikit.LayerController();
    var poiLayer = layerCtrl.getLayerById('poi');

    $scope.sameRelationshap = null;
    $scope.poiSameMeta = null;
    $scope.same = {};
    $scope.same.sameTplShow = false; //用于控制同一POI制作面板是否显示

    $scope.$on('showSamePoishap',function (event,data){
        $scope.sameRelationshap = data.data;
        $scope.poiSameMeta = data.meta;
        $scope.same.sameNameList = [];
        for(var i = 0 , len = data.data.length; i < len ; i ++){
            if(data.data[i].properties.kindCode!=undefined){
                $scope.same.sameNameList.push({
                    id:data.data[i].properties.id,
                    name:data.data[i].properties.name,
                    kindName:$scope.poiSameMeta.kindFormat[data.data[i].properties.kindCode].kindName
                }) ;
            }
        }
        $scope.initializeData();
    });

    /**
     * 初始化方法
     */
    $scope.initializeData = function (){
        $scope.same.sameTplShow = true;
        $scope.same.sameDisabledIndex = -1;

    };

    $scope.minusSamePoi = function (num){
        if($scope.same.sameNameList.length == 1){
            $scope.same.sameNameList.splice(num,1);
            $scope.same.sameTplShow = false;
        }else {
            $scope.same.sameNameList.splice(num,1);
        }
    };

    /**
     * 保存
     */
    $scope.saveSame = function (){
        var ids = [];
        var param = {};
        param["command"] = "CREATE";
        param["dbId"] = App.Temp.dbId;
        param["type"] = "IXSAMEPOI";
        $scope.same.sameTplShow = false;
        for(var i = 0;i<$scope.same.sameNameList.length;i++){
            ids.push(parseInt($scope.same.sameNameList[i].id));
        }
        param["poiPids"] = ids;
        dsEdit.save(param).then(function (data) {
            if(data != null){
                poiLayer.redraw();
                map.currentTool.disable();
                swal("操作成功", "创建POI同一关系成功", "success");
            }
        })
    };

    /**
     * 取消
     */
    $scope.clearSame = function (){
        $scope.same = {};
        $scope.same.sameTplShow = false;
        // highRenderCtrl.highLightFeatures = [];
        // highRenderCtrl._cleanHighLight();
    };

    $scope.initializeData();

}]);