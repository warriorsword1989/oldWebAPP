/**
 * Created by linglong;
 * Email: linglong@navinfo.com;
 * Date 2016/8/31;
 * Time 11:36
 */
angular.module('app').controller('photoEngNameCtrl', ['$scope', '$ocLazyLoad',"$q", 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', '$document', 'appPath', '$interval', '$timeout','dsColumn', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad,$q, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, $document, appPath, $interval, $timeout, dsColumn, dsMeta,$compile,$attrs) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        //当前作业项标识，为请求数据列表得固定参数;
        $scope.secondWorkItem = 'photoEngName';
        //标识是否作业过;
        $scope.isOnlineChecked = false;
        //控制"待作业/待提交"的切换，同时也是请求数据列表得参数;
        $scope.status = '1';

        $scope.onlineCheck = false;
        $scope.tableDataList = null;
        $scope.currentEditData = null;
        $scope.costomWorkNumEum = [{'num':10,'desc':'每次10条'},{'num':20,'desc':'每次20条'},{'num':30,'desc':'每次30条'},{'num':'','desc':'自定义'}];
        $scope.progressValue = 0;
        $scope.selectedNum = 10;
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.batchWorkIsOpen = false;
        $scope.isQuery = true;
        $scope.currentEditremain = [];

        $scope.view = {};
        $scope.view.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'70px'},
            { field: "num_index",title:'编号', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'130px', sortable: "classifyRules11"},
            { field: "kindCodeName", title: "分类",show: true,width:'130px', sortable: "kind"},
            { field: "name11Chi", title: "官方标准中文名称",getValue:get11ChiNames,show: true, sortable: "name11Chi"},
            { field: "name12Eng", title: "原始英文名称",getValue:get12EngNames,show: true, sortable: "name12Eng"},
            { field: "pid", title: "PID",show: false,width:'100px', sortable: "pid"}
        ];
        /*--------------------------格式化数据部分--------------------------*/
        function get11ChiNames($scope, row){
            return row.name11Chi.name;
        }
        function get12EngNames($scope, row){
            return row.name12Eng.name;
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
            angular.forEach($scope.tableDataList, function(item) {
                item.selector = value;
            });
        });

        /*获得表格数据*/
        function getTableData(){
            var defer = $q.defer();
            var param = {
                'subtaskId': parseInt(App.Temp.subTaskId),
                'type':$scope.isOnlineChecked?'integrate':'snapshot',
                'status':$scope.status,
                'secondWorkItem':$scope.secondWorkItem
            };
            dsMeta.columnDataList(param).then(function(data) {
                if(data){
                    $scope.loadTableDataMsg = '列表无数据';
                    var temp = new FM.dataApi.ColPoiList(data.data);
                    $scope.tableDataList = temp.dataList;
                    defer.resolve($scope.tableDataList);
                }else{
                    defer.resolve(null);
                }
            });
            return defer.promise;
        }
        //搜索;
        $scope.$watch('globalSearchTerm',function(to,from){
            if(to!=from){
                var term = to;
                _self.tableParams.filter({ $: term });
            }
        })
        //初始化表格;
        function initRoadNameTable(){
            getTableData().then(function(data){
                if(data){
                    _self.tableParams = new NgTableParams({count:4,sorting: {pid: "asc"}},{counts: [],dataset: data})
                }
            });
        }
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            angular.forEach($scope.tableParams.data, function(data, index) {
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.selector = false;//默认增加checked属性
            });
            $scope.originalTableData = angular.copy($scope.tableDataList);
        });

        /*--------------------------页面事件监听--------------------------*/
        //待作业和待提交切换控制;
        $scope.changeTaskStatus = function(params){
            $scope.status = params;
            initRoadNameTable();
        }
        //设置每次作业条数的radio选择逻辑;
        $scope.selectNum = function(params,arg2){
            $scope.inputIsShow = arg2==3?true:false;
            $scope.costomWorkNumEum[3].num = '';
            $scope.selectedNum = params.num;
        }
        /*设置每次作业的条数*/
        $scope.setInputValue = function(params){
            $scope.costomWorkNumEum[3].num = parseInt(params);
            if(params<=0){
                alert('必须大于零的整数!');
                return;
            }else{
                $scope.selectedNum = parseInt(params);
            }
            $scope.popoverIsOpen = false;
        }

        /*---------------------------------------批处理部分---------------------------------------*/
        $scope.batchParam = {
            value : "",
            batchField : ""
        };
        var replaceOpt = [
            {"id": "name12Eng", "label": "原始英文名称"}
        ];
        var searchOpt = [
            {"id": "name11Chi", "label": "官方标准中文名称"},
            {"id": "name12Eng", "label": "原始英文名称"}
        ];
        $scope.batchTabs = function(flag){
            $scope.batchFlag = flag;
            if(1 == flag){
                $scope.batchOpt = replaceOpt;
                $scope.batchParam.batchField = "name12Eng";
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

        /*搜索满足的数据*/
        $scope.searchWork = function(){
            var temp = $scope.tableDataList;
            var checkedArr = [];
            for (var i = 0 ,len = temp.length ;i < len ; i ++){
                if(temp[i].checked){
                    checkedArr.push(temp[i]);
                }
            }
            var editArr = [];
            if(checkedArr.length > 0){
                editArr = checkedArr;
            } else {
                editArr = $scope.tableDataList;
            }
            var currentValue;
            var resultArr = [];
            for(var item in editArr){
                currentValue = editArr[item][$scope.batchParam.batchField].name;
                if(currentValue && currentValue.indexOf($scope.batchParam.value)!= -1){
                    resultArr.push(editArr[item]);
                }
            }
            if(resultArr.length == 0){
                return null;
            }else{
                return editArr = resultArr;
            }
        };

        $scope.extractData = function(){
            if(!$scope.batchParam.value){
                swal("请先输入搜索内容", "", "info");return;
            }else{
                var temp = $scope.searchWork();
                if(temp){
                    getCurrentSaveObject(temp);
                    initEditorTable();
                }else{
                    swal("当前没有符合条件的数据", "", "info");
                    return;
                }
            }
            $scope.editBatchWorkIsOpen = true;
            $scope.editDisable = true;
            $scope.isQuery = false;
        };

        $scope.closeBatchModal = function(){
            $scope.batchWorkIsOpen = false;
        };
        $scope.cancle = function(){
            $scope.closeBatchModal();
        };

        /*----------------------------------------------在线检查;----------------------------------------------*/
        $scope.startOnlineCheck = function(){
            $scope.onlineCheck = true;
            $scope.isOnlineChecked = true;
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
//            { field: "num_index", title: "序号",show: true,width:'20px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'70px'},
            { field: "name12Chi", title: "官方标准中文名称",getValue:get11ChiNames,show: true,width:'130px'},
            { field: "name11Chi", title: "原始英文名称",getValue: getEng12NameByEdit,html:true,show: true,width:'130px'},
            { field: "CharacterNumber", title: "字符数",show: true,width:'30px'},
            { field: "sourceFlag", title: "来源标识",html:true,getValue: sourceFlagSelect,show: true,width:'100px'},
            { field: "refMsg", title: "参考信息",show: true,width:'80px'},
            { field: "details", title: "详情",getValue: getDetails, html:true,show: true,width:'30px'}
        ];
        /**/
        function getEng12NameByEdit($scope,row){
            var html = "";
            html = "<input type='text' class='form-control input-sm table-input' title='{{row.name12Eng.name}}' value='row.name12Eng.name' ng-model='row.name12Eng.name' />";
            return html;
        };
        function sourceFlagSelect($scope, row){
            var html = "<select ng-model='row[col.field]' class='form-control table-input' ng-options='value.id as value.label for value in sourceFlag'> </select>"
            return html;
        }
        function getDetails($scope,row){
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }
        $scope.closeEditPanel = function (){
            $scope.isQuery = true;
            $scope.showImgInfoo = false;
            _self.tableParams.reload();
        };
        $scope.closeView = function (){
            alert($scope.isQuery)
        };

        function getCurrentSaveObject(checkedArr){
            if(checkedArr.length > 0){
                if(checkedArr.length>0&&checkedArr.length>=$scope.selectedNum){
                    $scope.currentEditData = checkedArr.splice(0,$scope.selectedNum);
                    $scope.currentEditremain = checkedArr;
                }else{
                    $scope.currentEditData = checkedArr.splice(0,checkedArr.length);
                }
            } else {
                $scope.currentEditData = $scope.tableDataList.slice(0,$scope.selectedNum);
            }
            //要编辑的数据;
            $scope.currentEditedData = angular.copy($scope.currentEditData);
        }

        //做弹框页面都要调的公共方法;
        function extractDataBeforEdit(){
            var checkedArr = [];
            for(var i=0;i<$scope.tableDataList.length;i++){
                if($scope.tableDataList[i].selector){
                    checkedArr.push(angular.copy($scope.tableDataList[i]));
                }
            }
            getCurrentSaveObject(checkedArr)
        }


        //双击td;
        $scope.selectData = function (row,index){
            $scope.isQuery = false;
            extractDataBeforEdit();
            initEditorTable();
        };

        $scope.saveData = function(){
            var chage = objCtrl.compareColumData($scope.currentEditData,$scope.currentEditedData);
            console.log(chage);
            if(true){
                if($scope.currentEditremain.length){
                    getCurrentSaveObject(angular.copy($scope.currentEditremain));
                    initEditorTable();
                }else{
                    alert('success')
                    alert('最后一条保存了')
                }
            }
            //var chage = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
        }

        function initEditorTable() {
            _self.editorTable = new NgTableParams({
            }, {
                counts:[],
                dataset: $scope.currentEditedData
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