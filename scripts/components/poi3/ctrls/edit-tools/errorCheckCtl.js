angular.module('app').controller('ErrorCheckCtl', ['$scope', 'dsPoi', 'dsEdit', function($scope,dsPoi,dsEdit) {

    var highRenderCtrl = new fastmap.uikit.HighRenderController();
    //初始化ng-table表头;
    $scope.cols = [
        {field: "ruleid", title: "检查规则号", show: true},
        {field: "rank", title: "错误等级", sortable: "rank", show: true},
        {field: "targets", title: "错误对象", sortable: "targets", show: true},
        {field: "information", title: "错误信息", sortable: "information", show: true},
        {field: "geometry", title: "几何信息", sortable: "geometry", show: false},
        {field: "create_date", title: "检查时间", sortable: "create_date", show: false,getValue:getCreateData},
        {field: "worker", title: "作业员", sortable: "pid", show: false},
        {field: "option", title: "检查管理", sortable: "option", show: false,getValue:getOption}
    ];
    /***************************** 以上为ngtable ********************************/
    $scope.theadInfo = ['检查规则号','错误等级','错误对象','错误信息','检查时间','作业员','检查管理'];
    //状态
    $scope.initTypeOptions = [
        {"id": 0, "label": " 未修改"},
        {"id": 1, "label": " 例外"},
        {"id": 2, "label": " 确认不修改"},
        {"id": 3, "label": " 确认已修改"}
    ];
    $scope.initType = 0;
    
    //修改状态
    $scope.changeType = function (selectInd, rowid) {
        dsEdit.updateCheckType(rowid, selectInd).then(function (data) {
            console.log('修改成功')
        });
    };
    /*高亮地图上poi*/
    $scope.showOnMap = function(pid,type){
        var param = {
            pid:pid,
            type:type.split('_').join('')
        };
        showOnMap(param.pid,param.type);
    };

    //点击数据在地图上高亮
    function showOnMap(id,type) {
        highRenderCtrl._cleanHighLight();
        if(highRenderCtrl.highLightFeatures!=undefined){
            highRenderCtrl.highLightFeatures.length = 0;
        }
        var highlightFeatures = [];
        dsEdit.getByPid(id,type).then(function (data) {
            if(data){
                switch (type){
                    case "RDLINK":
                        var linkArr = data.geometry.coordinates, points = [];
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
                        map.setView([data.geometry.coordinates[1][1], data.geometry.coordinates[1][0]], 17);
                        break;
                    case "IX_POI":
                        highLightFeatures.push({
                            id:id.toString(),
                            layerid:'poiPoint',
                            type:'poi',
                            style:{}
                        });
                        map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 17);
                        break;
                    case "RDRESTRICTION":
                        var limitPicArr = [];
                        layerCtrl.pushLayerFront('referencePoint');
                        highlightFeatures.push({
                            id: data.pid.toString(),
                            layerid:'restriction',
                            type:'restriction',
                            style:{}
                        });
                        highlightFeatures.push({
                            id: data["inLinkPid"].toString(),
                            layerid:'referenceLine',
                            type:'line',
                            style:{}
                        });
                        for (var i = 0, len = (data.details).length; i < len; i++) {
                            highlightFeatures.push({
                                id: data.details[i].outLinkPid.toString(),
                                layerid:'referenceLine',
                                type:'line',
                                style:{}
                            })
                        }
                        map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], 17);
                        break;
                    default :
                        layerCtrl.pushLayerFront("workPoint");
                        highlightFeatures.push({
                            id:data.rowkey,
                            layerid:'workPoint',
                            type:'workPoint',
                            style:{}
                        });
                        map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);
                        break;
                        highRenderCtrl.highLightFeatures = highLightFeatures;
                        highRenderCtrl.drawHighlight();

                }
            }
        })
    }
    //监听检查结果并获取
    /*eventController.on(eventController.eventTypes.CHEKCRESULT, function(event){
        $scope.rowCollection=event.errorCheckData;
    });*/
    /************** 数据格式化 **************/
    /*检查时间*/
    function getCreateData($scope,rows){
        return rows;
    }

    function getOption ($scope,rows){
        return rows;
    }
}]);