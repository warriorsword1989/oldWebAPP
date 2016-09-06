/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('ChinaAddressCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsColumn', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsColumn, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editLines = 2; //每页编辑的条数
        $scope.editCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = []; //查询列表数据
        $scope.currenteditig = []; //当前编辑的数据原始值
        $scope.currentEdited = []; //当前编辑的数据
        $scope.rowEditPanelShow = false; //行编辑面板显示状态
        $scope.costomWorkNumEum = [2,10,20,30];
        $scope.editModelRadio = 2;//列表模式
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.editModelUrl = 'editModel.html';
        $scope.batchFlag = 1;

        $scope.chageTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true},
            { field: "addressFullname", title: "地址全称",getValue: getFullName, show: true},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function getNames($scope, row){
            return row.name11Chi.name;
        }
        function getFullName($scope, row){
            return row.addressChi.fullname;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>'
            }
            return html;
        }

        $scope.selectData = function (row,index){
            var temp = $scope.tableParams.data;
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
                editArr = $scope.tableParams.data.slice(0,$scope.editLines);
            }
            console.info(editArr);
            $scope.editAllDataList = $scope.tableParams.data;
            $scope.currenteditig = angular.copy(editArr);
            $scope.currentEdited = angular.copy(editArr);
            $scope.editPanelIsOpen = true;
            initEditTable();
        };

        $scope.searchType = 'name';

        //表格配置搜索;
        $scope.filter = {
            name : "",
            nameGroup: "",
            admin: "",
            sql:""
        };
        //接收高级查询过滤条件
        $scope.$on("FITERPARAMSCHANGE",function(event,data){
            $scope.filter.name = data["name"];
            $scope.filter.nameGroup = data["nameGroupid"];
            $scope.filter.admin = data["admin"];
            $scope.filter.sql = data["sql"];
        });
        function initRoadNameTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: $scope.filter
            }, {
                counts: [],
                getData: function($defer, params) {
                    // var param = {
                    //     subtaskId: parseInt(App.Temp.subTaskId),
                    //     pageNum: params.page(),
                    //     pageSize: params.count(),
                    //     sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                    //     params:{"name":params.filter().name,"nameGroupid":params.filter().nameGroup,"admin":params.filter().admin,"sql":params.filter().sql}
                    // };
                    var param = {};
                    dsMeta.columnDataList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        // $scope.roadNameList = data.data;
                        // _self.tableParams.total(data.total);
                        // $defer.resolve(data.data);

                        var temp = new FM.dataApi.ColPoiList(data.data);
                        console.info(temp);
                        $scope.roadNameList = temp.dataList;
                        _self.tableParams.total(data.total);
                        $defer.resolve(temp.dataList);
                    });
                }
            });
        };
        //给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function() {
            $scope.tableParams.data.checkedAll = false;
            $scope.itemActive = -1;
            angular.forEach($scope.tableParams.data, function(data, index) {
                //data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.checked = false;//默认增加checked属性
            });
        });
        $scope.doCheckAll = function (){
            console.info($scope.tableParams);
            var flag  = false;
            if($scope.tableParams.data.checkedAll){
                flag = true;
            } else {
                flag = false;
            }
            angular.forEach($scope.tableParams.data, function(data, index) {
                data.checked = flag;
            });
        };

        $scope.customAsign = function (flag){
            if(flag == 1){
                $scope.customAsignOpen = false;
            } else {
                $scope.customAsignOpen = true;
            }
        };
        $scope.customConfirm = function(){
            $scope.customAsignOpen = false;
            $scope.popoverIsOpen = false;

        };

        /**************** 工具条begin ***************/
        $scope.submitData = function (){
            _self.editTable.reload();
        };
        $scope.saveData = function (){
            //获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditig,$scope.currentEdited);
            console.info(chage);
            //调用接口

        };
        /**************** 工具条end   ***************/

        /*******************  表格编辑页面begin  ****************/
        $scope.edit = {};
        $scope.edit.editCols = [
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true,width:'100'},
            { field: "addressFullname", title: "地址全称",getValue: getFullName, show: true,width:'100'},
            { field: "province", title: "省名",getValue: getColName,html:true,show: true},
            { field: "city", title: "市名",getValue: getColName,html:true,show: true},
            { field: "county", title: "区县名",getValue: getColName,html:true,show: true},
            { field: "town", title: "乡镇街道办",getValue: getColName,html:true,show: true,width:'80'},
            { field: "place", title: "地区小区名",getValue: getColName,html:true,show: true,width:'80'},
            { field: "street", title: "街巷名",getValue: getColName,html:true,show: true},
            { field: "landmark", title: "标志物名",getValue: getColName,html:true,show: true},
            { field: "prefix", title: "前缀",getValue: getColName,html:true,show: true},
            { field: "housenum", title: "门牌号",getValue: getColName,html:true,show: true},
            { field: "type", title: "类型名",getValue: getColName,html:true,show: true},
            { field: "subnum", title: "字号",getValue: getColName,html:true,show: true},
            { field: "subfix", title: "后缀",getValue: getColName,html:true,show: true},
            { field: "estab", title: "附属设施名",getValue: getColName,html:true,show: true,width:'80'},
            { field: "building", title: "楼栋名",getValue: getColName,html:true,show: true},
            { field: "floor", title: "楼层",getValue: getColName,html:true,show: true},
            { field: "unit", title: "楼门号",getValue: getColName,html:true,show: true},
            { field: "room", title: "房间号",getValue: getColName,html:true,show: true},
            { field: "addons", title: "附加",getValue: getColName,html:true,show: true},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true}
        ];

        var html = "";
        if('CHI' == 'CHI'){ //测试用，大陆数据
            html = "<input type='text' class='form-control input-sm table-input' title='{{row[col.field]}}' value='row[col.field]' ng-model='row.addressChi[col.field]' />";
        }
        function getColName($scope,row){
            return html;
        }

        function getDetails($scope,row){
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }

        function initEditTable() {
            _self.editTable = new NgTableParams({
            }, {
                counts:[],
                dataset: $scope.currentEdited
            });
        };

        $scope.closeEditPanel = function (){
            $scope.editPanelIsOpen = false;
            $scope.showImgInfo = false;
            _self.tableParams.reload();
        };

        $scope.showView = function (){
            $scope.showImgInfo = true;
            $scope.slides = [
                {
                    id:1,
                    image:"../../../images/poi/main/test.png",
                    text:'111'
                },{
                    id:2,
                    image:"../../../images/poi/main/test.png",
                    text:'222'
                },{
                    id:3,
                    image:"../../../images/poi/main/test.png",
                    text:'333'
                }
            ];
            //$scope.$apply();
        };
        $scope.closeView = function (){
            $scope.showImgInfo = false;
        };

        $scope.changeEditModel = function (val){
            $scope.editModelRadio = val;
        };


        /*******************  表格编辑页面end  ******************/
        /*******************  行编辑页面begin  ******************/
        $scope.currentEditIndex = 0;

        $scope.editRowData = function (row,index){
            if($scope.editModelRadio == 2){ // 列表模式
                return;
            }
            $scope.currentEditIndex = index;
            $scope.rowEditPanelShow = true;
            $scope.rowEditData = row.addressChi;
            console.info($scope.rowEditData);
        };
        //清除18个字段
        $scope.clearPartData = function(){
            $scope.rowEditData.province = "";
            $scope.rowEditData.city = "";
            $scope.rowEditData.county = "";
            $scope.rowEditData.town = "";
            $scope.rowEditData.place = "";
            $scope.rowEditData.street = "";
            $scope.rowEditData.landmark = "";
            $scope.rowEditData.prefix = "";
            $scope.rowEditData.housenum = "";
            $scope.rowEditData.type = "";
            $scope.rowEditData.subnum = "";
            $scope.rowEditData.subfix = "";
            $scope.rowEditData.estab = "";
            $scope.rowEditData.building = "";
            $scope.rowEditData.floor = "";
            $scope.rowEditData.unit = "";
            $scope.rowEditData.room = "";
            $scope.rowEditData.addons = "";
        };
        $scope.closeEditView = function (){
            $scope.rowEditPanelShow = false;
        };
        $scope.nextItem = function (){
            var count = $scope.currentEdited.length;
            if($scope.currentEditIndex >= count-1){
                swal("操作提示", '已经是最后一条了！', "warning");
                return ;
            }
            if($scope.currentEditIndex < count-1 ){
                $scope.currentEditIndex ++;
            }
            $scope.rowEditData = $scope.currentEdited[$scope.currentEditIndex].addressChi;
        };
        $scope.preItem = function (){
            if($scope.currentEditIndex == 0){
                swal("操作提示", '已经是第一条了！', "warning");
                return ;
            }
            if($scope.currentEditIndex > 0){
                $scope.currentEditIndex --;
            }
            $scope.rowEditData = $scope.currentEdited[$scope.currentEditIndex].addressChi;
        };

        /*******************  行编辑页面end  *******************/


        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
            //initEditTable();
        }
        initPage();
    }
]);