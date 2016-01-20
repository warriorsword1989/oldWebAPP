/**
 * Created by liuzhaoxia on 2016/1/4.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneKindCtrl", function ($scope) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    var dataTipsCtrl = new fastmap.uikit.DataTipsController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController({});
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var workPoint = layerCtrl.getLayerById("workPoint");

    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    /*种别*/
    $scope.returnKindType = function(code){
        switch(code){
            case 0:
                return '作业中';
            case 1:
                return "高速道路";
            case 2:
                return "城市高速";
            case 3:
                return "国道";
            case 4:
                return "省道";
            case 5:
                return "预留";
            case 6:
                return "县道";
            case 7:
                return "乡镇村道路";
            case 8:
                return "其他道路";
            case 9:
                return "非引导道路";
            case 10:
                return "步行道路";
            case 11:
                return "人渡";
            case 13:
                return "轮渡";
            case 15:
                return "10级路（障碍物）";
        }
    }

    //初始化DataTips相关数据
    $scope.initializeDataTips = function() {
        $scope.$parent.$parent.showLoading = true;  //showLoading
        $scope.dataTipsData = selectCtrl.rowKey;
        $scope.photos = [];
        var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
            map: map,
            highLightFeature: "dataTips",
            dataTips: $scope.dataTipsData.rowkey
        });
        highLightDataTips.drawTipsForInit();
        highLightLayer.pushHighLightLayers(highLightDataTips);

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
        $scope.kindType = $scope.returnKindType($scope.dataTipsData.kind);
        $scope.fData=selectCtrl.rowKey.f;

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
        $scope.$parent.$parent.showLoading = false;  //showLoading
    };
    if (selectCtrl.rowKey) {
        //dataTips的初始化数据
        $scope.initializeDataTips();

    }
    selectCtrl.updateKindTips = function () {
        $scope.initializeDataTips();
    }
    /*转换*/
    $scope.transBridge = function(){
        $scope.$parent.$parent.showLoading = true;  //showLoading
        var kindObj = {
            "objStatus":"UPDATE",
            "pid":parseInt($scope.dataTipsData.f.id),
            "kind":$scope.dataTipsData.kind
        };
        var param = {
            "type":"RDLINK",
            "command": "UPDATE",
            "projectId": 11,
            "data":kindObj
        };
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$parent.$parent.$apply();
            if(data.errcode==0){
                swal("操作成功", "种别转换操作成功！", "success");
            }else{
                swal("操作失败", data.errmsg, "error");
            }
            /*var info = [];
            if (data.data) {
                $.each(data.data.log, function (i, item) {
                    if (item.pid) {
                        info.push(item.op + item.type + "(pid:" + item.pid + ")");
                    } else {
                        info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                    }
                });
            } else {
                info.push(data.errmsg + data.errid)
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }*/
        })
    }
    $scope.openOrigin = function (id) {
        if(id <= selectCtrl.rowKey.f_array.length-1){
            $scope.openshotoorigin = selectCtrl.rowKey.f_array[id];
            $("#dataTipsOriginImg").attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            $("#dataTipsOriginModal").modal('show');
        }
    }
});