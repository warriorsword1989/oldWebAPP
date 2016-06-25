/**
 * Created by zhaohang on 2016/4/7.
 */
var rwLinkZone = angular.module("app");
rwLinkZone.controller("rwLinkController",["$scope" , "appPath",function($scope,appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();


    $scope.kind = [
        {"id": 1, "label": "铁路"},
        {"id": 2, "label": "磁悬浮"},
        {"id": 3, "label": "地铁/轻轨"}
    ];
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "桥"},
        {"id": 2, "label": "隧道"}
    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];
    $scope.detailFlag = [
        {"id": 0, "label": "不应用"},
        {"id": 1, "label": "只存在于详细区域"},
        {"id": 2, "label": "只存在于广域区域"},
        {"id": 3, "label": "存在于详细和广域区域"}
    ];

    var index = 0 ;

    $scope.initializeData = function(){
        // if(index > 0 ){
        //     return ;
        // }
        index ++;
        $scope.rwLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());

        var linkArr = $scope.rwLinkData.geometry.coordinates,points = [];
        for (var i = 0, len = linkArr.length; i < len; i++){
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0],linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry:line,
            id:$scope.rwLinkData.pid
        });
        var highLightFeatures = [];
        highLightFeatures.push({
            id:$scope.rwLinkData.pid.toString(),
            layerid:'rwLink',
            type:'line',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();




        // var linkArr =$scope.adLinkData.geometry.coordinates, points = [];
        // for (var i = 0, len = linkArr.length; i < len; i++) {
        //     var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
        //     points.push(pointOfLine);
        // }
        // var line = fastmap.mapApi.lineString(points);
        // selectCtrl.onSelected({//存储选择数据信息
        //     geometry: line,
        //     id: $scope.adLinkData.pid
        // });


        $scope.dataTipsData = selectCtrl.rowKey;
        $scope.currentURL = "";

        /*//随着地图的变化 高亮的线不变
        if($scope.dataTipsData && $scope.dataTipsData.f_array && $scope.dataTipsData.f_array.length > 0){
            var linksArr = [];
            var highLightFeatures = [];
            for(var item in $scope.dataTipsData.f_array){
                linksArr.push($scope.dataTipsData.f_array[item].id);
                highLightFeatures.push({
                    id:$scope.dataTipsData.f_array[item].id,
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                })
            }

            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();
        }else{
            highRenderCtrl.highLightFeatures.push({
                id:$scope.rwLinkData.pid.toString(),
                layerid:'referenceLine',
                type:'line',
                style:{}
            });
            highRenderCtrl.drawHighlight();
        }

        var linkArr =$scope.rwLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var pointOfSelect = selectCtrl.selectedFeatures["point"];
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry: line,
            id: $scope.rwLinkData.pid,
            type:"Link",
            direct: $scope.rwLinkData.direct,
            snode: $scope.rwLinkData.sNodePid,
            enode: $scope.rwLinkData.eNodePid,
            point: pointOfSelect
        });*/
    };


    $scope.save = function(){

    };

    $scope.delete = function(){

    };
    $scope.cancel = function(){

    };

    $scope.rwLinkName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl": appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml": appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    };
    /**
     * 增加铁路名
     */
    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rwLinkName({"linkPid": $scope.rwLinkData.pid});
        $scope.rwLinkData.names.unshift(newName);
    };

    $scope.minusName = function (id) {
        $scope.rwLinkData.names.splice(id, 1);
    };
    $scope.changeColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    };
    $scope.backColor = function (ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    };
    $scope.showNames = function (nameItem,index) {
        objCtrl.data.rwName = objCtrl.data.names[index]; //将需要编辑的name保存在rwName中
        var showNamesObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl": appPath.road + 'ctrls/attr_link_ctrl/namesOfRwDetailCtrl',
            "propertyHtml": appPath.root + appPath.road + 'tpls/attr_link_tpl/namesOfRwDetailTpl.html',
            callback:function (){
                eventController.fire('CHANGELINKNAME',{});
            }
        };
        $scope.$emit("transitCtrlAndTpl", showNamesObj);
    };

    /**
     * 初始化方法执行
     */
    if (objCtrl.data) {
        $scope.initializeData();
    }

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
