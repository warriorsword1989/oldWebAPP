/**
 * Created by wuzhen on 2016/7/24.
 * 警示信息面板
 */
angular.module('app').controller('hgwgLimitCtl', ['$scope','$timeout', 'dsEdit','appPath','$ocLazyLoad', function($scope,$timeout,dsEdit, appPath,$ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var relationData = layerCtrl.getLayerById('relationData');

    $scope.directList = [
        {id:0,label:"未调查"},
        {id:2,label:"顺方向"},
        {id:3,label:"逆方向"}
    ];

    $scope.initializeData = function(){
        if($scope.hgwgLimitForm) {
            $scope.hgwgLimitForm.$setPristine();
        }
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.hgwgLimitObj = objCtrl.data;
        if($scope.hgwgLimitObj.geometry && $scope.hgwgLimitObj.geometry.coordinates.length == 2){
            $scope.hgwgLimitObj.geometryStr = $scope.hgwgLimitObj.geometry.coordinates[0]+","+$scope.hgwgLimitObj.geometry.coordinates[1];
        }

        highRenderCtrl.cleanHighLight();
        var highlightFeatures = [];
        highlightFeatures.push({
            id:$scope.hgwgLimitObj.linkPid.toString(),
            layerid:'rdLink',
            type:'line',
            style:{}
        });
        highlightFeatures.push({
            id: $scope.hgwgLimitObj.pid.toString(),
            layerid: 'relationData',
            type: 'relationData',
            style: {}
        });

        highRenderCtrl.highLightFeatures = highlightFeatures;
        highRenderCtrl.drawHighlight();
    };

    $scope.formateNumbers=function(field,maxVal,len){
        var val = $scope.hgwgLimitObj[field];
        if(!val){
            $scope.hgwgLimitObj[field] = 0.00;
            return;
        }
        var b = parseFloat(val);
        if(b > maxVal){
            b = maxVal;
        }
        $scope.hgwgLimitObj[field] = parseFloat(Number(b).toFixed(len));
    };

    //根据pid重新请求数据
    $scope.refreshData = function() {
        dsEdit.getByPid($scope.hgwgLimitObj.pid, "RDHGWGLIMIT").then(function(data) {
            if (data) {
                objCtrl.setCurrentObject("RDHGWGLIMIT", data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };

    $scope.cancel = function (){
    };

    // 保存数据
    $scope.save  = function () {
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        dsEdit.update($scope.hgwgLimitObj.pid, "RDHGWGLIMIT", objCtrl.changedProperty).then(function(data) {
            if (data) {
                relationData.redraw();
                $scope.refreshData();
            }
        });
        $scope.$emit("SWITCHCONTAINERSTATE", {"subAttrContainerTpl": false});
    };
    // 删除数据
    $scope.del = function() {
        dsEdit.delete($scope.hgwgLimitObj.pid, "RDHGWGLIMIT").then(function(data) {
            if (data) {
                relationData.redraw();
                $scope.hgwgLimitObj = null;
                highRenderCtrl.cleanHighLight(); //清空高亮
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };

    /* start 事件监听 ********************************************************/
    eventCtrl.on(eventCtrl.eventTypes.SAVEPROPERTY, $scope.save); // 保存
    eventCtrl.on(eventCtrl.eventTypes.DELETEPROPERTY, $scope.del); // 删除
    eventCtrl.on(eventCtrl.eventTypes.CANCELEVENT, $scope.cancel); // 取消
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    $scope.initializeData();
}]);