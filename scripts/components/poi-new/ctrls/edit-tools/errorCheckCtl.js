angular.module('app').controller('ErrorCheckCtl', ['$scope', 'dsPoi', function($scope,dsPoi) {

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
        dsPoi.updateCheckType(rowid, selectInd).then(function (data) {
            console.log('修改成功')
        });
    };
    /*高亮地图上poi*/
    $scope.showPoiOnMap = function(pid){
        var param = {
            pid:pid,
            type:'IX_POI'
        };
        $scope.$emit('getHighlightData',param);
    };

    //点击数据在地图上高亮
    $scope.showOnMap = function (targets,geom) {
        var value = targets.replace("[", "");
        var value1 = value.replace("]", "");

        var data = {
            pid:value1.split(",")[1],
            type:value1.split(",")[0].replace("_", "")
        };
        $scope.$emit('getHighlightData',data);
    };


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