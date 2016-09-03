/**
 * Created by linglong;
 * Email: linglong@navinfo.com;
 * Date 2016/8/31;
 * Time 11:36
 */
angular.module('app').controller('photoEngNameCtrl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var _self = $scope;
        $scope.currentTableData = null;
        $scope.currentEditData = null;
        $scope.currentTabIndex = 'stagnatedWork';
        $scope.costomWorkNumEum = [10,20,30,0];
        $scope.onlineCheck = false;
        $scope.progressValue = 0;
        $scope.selectedNum = 10;
        $scope.inputValue = 0;
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.batchWorkIsOpen = false;
        $scope.isQuery = true;

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
        function getFullName($scope, row){
            return row.addressChi.fullName;
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
            $scope.originalTableData = angular.copy($scope.currentTableData);
        });

        /*--------------------------页面事件监听--------------------------*/
        //待作业和待提交切换控制;
        $scope.changeTaskStatus = function(params){
            $scope.currentTabIndex = params;
        }
        //
        $scope.selectNum = function(params){
            $scope.selectedNum = params;
        }
        $scope.setInputValue = function(params){
            $scope.selectedNum = params;
            $scope.popoverIsOpen = false;
        }
        //batch work
        $scope.batchParam = {
            value : "",
            batchField : ""
        };
        var replaceOpt = [
            {"id": "name12Chi", "label": "原始英文名称"}
        ];

        var searchOpt = [
            {"id": "name12Chi", "label": "官方标准中文名称"},
            {"id": "name11Chi", "label": "原始英文名称"}
        ];
        $scope.batchTabs = function(flag){
            $scope.batchFlag = flag;
            if(1 == flag){
                $scope.batchOpt = replaceOpt;
                $scope.batchParam.batchField = "name12Chi";
                $scope.extractEle = true;
                $scope.searchBtn = false;
            }else if(2 == flag){
                $scope.batchOpt = searchOpt;
                $scope.batchParam.batchField = "name11Chi";
                $scope.extractEle = false;
                $scope.searchBtn = true;
            }
        };
        $scope.batchWork = function(flag){
            $scope.batchWorkIsOpen = true;
            $scope.batchTabs(1);
        };
        $scope.closeBatchModal = function(){
            $scope.batchWorkIsOpen = false;
        };
        $scope.cancle = function(){
            $scope.closeBatchModal();
        };
        //batch work
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
        /*---------------------------------------编辑部分---------------------------------------*/
        $scope.editor = {};
        $scope.editor.editorCols = [
            { field: "num_index", title: "序号",show: true,width:'20px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'50px'},
            { field: "kindCode", title: "分类",show: true,width:'50px'},
            { field: "kindCode", title: "品牌名",show: true,width:'50px'},
            { field: "name12Chi", title: "官方原始名称",getValue:get12Names,show: true,width:'80px'},
            { field: "addressFullname", title: "父名称",getValue: getFullName, show: true,width:'50px'},
            { field: "name11Chi", title: "标准中文名称",getValue: getName,html:true,show: true,width:'150px'},
            { field: "refMsg", title: "参考信息",show: true,width:'50px'},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true,width:'30px'}
        ];
        /**/
        var html = "";
        if('CHI' == 'CHI'){ //测试用，大陆数据
            html = "<input type='text' class='form-control input-sm table-input' title='{{row.name11Chi.name}}' value='row.name11Chi.name' ng-model='row.name11Chi.name' />";
        }
        function getName($scope,row){
            return html;
        };
        function getDetails($scope,row){
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }
        $scope.closeEditPanel = function (){
            $scope.isQuery = true;
            $scope.editPanelIsOpen = false;
            $scope.showImgInfoo = false;
            _self.tableParams.reload();
        };
        $scope.closeView = function (){
            alert($scope.isQuery)
        };
        //做弹框页面都要调的公共方法;
        function extractDataBeforEdit(){
            var checkedArr = [];
            for(var i=0;i<$scope.currentTableData.length;i++){
                if($scope.currentTableData[i].selector){
                    checkedArr.push(angular.copy($scope.currentTableData[i]));
                }
            }
            if(checkedArr.length > 0){
                $scope.currentEditData = checkedArr;
            } else {
                $scope.currentEditData = $scope.currentTableData.slice(0,$scope.selectedNum);
            }
        }
        //双击td;
        $scope.selectData = function (row,index){
            $scope.isQuery = false;
            extractDataBeforEdit();
            initEditorTable();
        };

        function initEditorTable() {
            _self.editorTable = new NgTableParams({
            }, {
                counts:[],
                dataset: $scope.currentEditData
            });
        };

        //$scope.extractData = function(){
        //    //判断有没有输入；
        //    if(/*有输入*/){
        //        if(!checked){
        //            //根据输入搜索默认设置的数据条数;
        //        }else if(check.length<custom.length){
        //            //根据输入在选择的数据里找;
        //        }else{
        //            //根据输入在设置的数据里提取;并提取剩余的
        //        }
        //    }else{
        //        //提示错误
        //    }
        //
        //}






        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
        }
        initPage();
    }
]);