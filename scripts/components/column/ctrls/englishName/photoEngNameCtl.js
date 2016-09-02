/**
 * Created by linglong;
 * Email: linglong@navinfo.com;
 * Date 2016/8/31;
 * Time 11:36
 */
angular.module('app').controller('photoEngNameCtrl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var _self = $scope;
        //
        $scope.currentTableData = null;
        $scope.currentTabIndex = 'stagnatedWork';
        $scope.costomWorkNumEum = [10,20,30,0];
        $scope.onlineCheck = false;
        $scope.progressValue = 0;
        $scope.selectedNum = 10;
        $scope.inputValue = 0;
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';

        $scope.view = {};
        $scope.view.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "num_index",title:'编号', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "kind", title: "分类",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "name11Chi", title: "标准中文名称",getValue:get11Names,show: true,width:'150px'},
            { field: "name12Chi", title: "原始英文名称",getValue:get12Names,show: true,width:'150px'},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];
        /*--------------------------格式化数据部分--------------------------*/
        function get11Names($scope, row){
            return row.name11Chi.name;
        }
        function get12Names($scope, row){
            return row.name12Chi.name;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
            }
            return html;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
            }
            return html;
        }
        /*--------------------------格式化数据部分--------------------------*/
        //表格多选控制;
        $scope.checkboxes = {checked: false};
        // 全选控制;
        $scope.$watch(function() {
            return $scope.checkboxes.checked;
        }, function(value) {
            angular.forEach($scope.currentTableData, function(item) {
                item.selector = value;
            });
        });

        //初始化表格;
        function initRoadNameTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count:2
            }, {
                counts: [],
                getData: function($defer, params) {
                    var param = {
                        subtaskId: parseInt(App.Temp.subTaskId),
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                        params:{"name":params.filter().name,"nameGroupid":params.filter().nameGroup,"admin":params.filter().admin,"sql":params.filter().sql}
                    };
                    dsMeta.columnDataList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        var temp = new FM.dataApi.ColPoiList(data.data);
                        $scope.currentTableData = temp.dataList;
                        _self.tableParams.total(data.total);
                        $defer.resolve($scope.currentTableData);
                    });
                }
            });
            //固定分页位置;
            var timer = setInterval(function(){
                if($(".content .dark > div").get(0)){
                    $('.content').append($(".content .dark > div"));
                    $(".content > div").eq(1).css('padding','0 10px');
                    clearInterval(timer);
                }
            },30)
        };

        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            angular.forEach($scope.tableParams.data, function(data, index) {
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.selector = false;//默认增加checked属性
            });
        });

        /*--------------------------页面事件监听--------------------------*/
        //待作业和待提交切换控制;
        $scope.changeTaskStatus = function(params){
            $scope.currentTabIndex = params;
        }
        $scope.selectNum = function(params){
            $scope.selectedNum = params;
        }
        $scope.setInputValue = function(params){
            $scope.selectedNum = params;
            $scope.popoverIsOpen = false;
        }
        //在线检查;
        $scope.startOnlineCheck = function(){
            $scope.onlineCheck = true;
            $scope.showLoading = true;
            console.log($scope)
            //假控制;
            var timer = setInterval(function(){
                $scope.$apply(function(){
                    if($scope.progressValue>=100){
                        $scope.onlineCheck = false;
                        $scope.progressValue = 0;
                        clearInterval(timer);
                    }
                    $scope.progressValue += 5;
                })
            },300);
        }
        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
        }
        initPage();
    }
]);