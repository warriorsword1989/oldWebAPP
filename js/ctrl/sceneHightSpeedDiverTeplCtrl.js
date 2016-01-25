/**
 * Created by liuzhaoxia on 2016/1/4.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneHightSpeedDiverTeplCtrl", function ($scope) {
    var dataTipsCtrl = new fastmap.uikit.DataTipsController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var workPoint = layerCtrl.getLayerById("workPoint");
    $scope.photos = [];
    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.outIdS=[]; 

    if (selectCtrl.rowKey) {
        //初始化dataTips面板中的数据
        $scope.dataTipsData = selectCtrl.rowKey;
        // console.log($scope.dataTipsData);
        $scope.oarrayData=$scope.dataTipsData.o_array;
        for(var i in $scope.oarrayData){
        //.d_array[$index].out[$index].id
            for(var j in $scope.oarrayData[i].d_array){
                for(var m in $scope.oarrayData[i].d_array[j].out){
                    $scope.outIdS.push({id:$scope.oarrayData[i].d_array[j].out[m].id});
                }
            }
        }
        //dataTips的初始化数据
        initializeDataTips();

    } else {
        $scope.rdSubTipsData = [];
    }

    //初始化DataTips相关数据
    function initializeDataTips() {
        /*进入*/
        $scope.sceneEnty = $scope.dataTipsData.in.id;
        /*模式图号*/
        $scope.schemaNo = $scope.dataTipsData.ptn;
        /*退出*/
        $scope.sceneExit = [];
        $.each($scope.dataTipsData.o_array,function(i,v){
            $scope.sceneExit.push(v.out.id);
        });
        //显示状态
        if ($scope.dataTipsData) {
            switch ($scope.dataTipsData.t_lifecycle) {
                case 1:
                    $scope.showContent = "外业删除";
                    break;
                case 2:
                    $scope.showContent = "外业修改";
                    break;
                case 3:
                    $scope.showContent = "外业新增";
                    break;
                case 0:
                    $scope.showContent = "默认值";
                    break;
            }
        }

        //获取数据中的图片数组
        $scope.photoTipsData = selectCtrl.rowKey.f_array;


        for (var i in  $scope.photoTipsData) {
            if ($scope.photoTipsData[i].type === 1) {
                var content = Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.photoTipsData[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
            } else if ($scope.photoTipsData[i].type === 3) {
                $scope.remarksContent = $scope.photoTipsData[i].content;
            }

        }
        if ($scope.photos.length != 0 && $scope.photos.length < 4) {
            for (var a = $scope.photos.length; a < 4; a++) {
                var imgs = "./css/img/noimg.png";
                $scope.photos.push(imgs);
            }
        } else {
            for (var j = 0; j < 4; j++) {
                var newimgs = "./css/img/noimg.png";
                $scope.photos.push(newimgs);
            }
        }

    };
});