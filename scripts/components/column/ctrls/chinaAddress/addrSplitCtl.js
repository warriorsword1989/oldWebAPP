/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('ChinaAddressCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsColumn', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsColumn, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope , areaFlag = "CHI";
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editLines = 10; //每页编辑的条数
        $scope.editCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = [];//查询列表数据
        $scope.tableDataList = [];  //存储查询列表数据
        $scope.currentEditOrig  = []; //当前编辑的数据原始值
        $scope.currentEdited = []; //当前编辑的数据
        $scope.rowEditPanelShow = false; //行编辑面板显示状态
        $scope.editModelRadio = 2;//列表模式
        $scope.secondWorkItem = "addrSplit";

        //popover
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNumEum = [{'num':10,'desc':'每次10条'},{'num':20,'desc':'每次20条'},{'num':30,'desc':'每次30条'},{'num':'','desc':'自定义'}];

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
            var type = row.classifyRules.split(',');
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>'
            }
            return html;
        }

        $scope.selectData = function (row,index){
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

            $scope.getPerPageEditData(editArr);
            console.info(editArr);
            $scope.batchWorkIsOpen = false;
            $scope.batchParam.value = "";
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
                    //     "type":'integrate',
                    //     "firstWorkItem":"poi_address",
                    //     "secondWorkItem":"addrSplit",
                    //     "status":1
                    // };
                    // dsColumn.queryColumnDataList(param).then(function (data){
                    //     $scope.loadTableDataMsg = '列表无数据';
                    //         // $scope.roadNameList = data.data;
                    //         // _self.tableParams.total(data.total);
                    //         // $defer.resolve(data.data);
                    //
                    //         var temp = new FM.dataApi.ColPoiList(data);
                    //         console.info(temp);
                    //         $scope.roadNameList = temp.dataList;
                    //         _self.tableParams.total(data.total);
                    //         $defer.resolve(temp.dataList);
                    // });

                    var param = {
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                        params:{
                            "type":'integrate',
                            "secondWorkItem":"addrSplit",
                            "status":1
                        }
                    };
                    var param = {};
                    dsMeta.columnDataList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        var temp = new FM.dataApi.ColPoiList(data.data);
                        $scope.tableDataList = new FM.dataApi.ColPoiList(data.data).dataList;
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
            angular.forEach($scope.tableDataList, function(data, index) {
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
        //提交数据
        $scope.submitData = function (){
            $scope.showLoading = true;
            dsColumn.submitData($scope.firstWorkItem,$scope.secondWorkItem).then(function (data){
                $scope.showLoading = false;
                if(data){
                    _self.tableParams.reload();
                }
            });
        };
        $scope.saveData = function (){
            //获取改变的数据
            var change = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
            console.info(change);
            //调用接口

            if($scope.editAllDataList.length < $scope.editLines){
                swal("已经是最后一页了!", "", "info");
                return ;
            }
            //调用接口
            $scope.getPerPageEditData($scope.editAllDataList);
            initEditTable();
        };

        //设置每次作业条数的radio选择逻辑;
        $scope.selectNum = function(params,arg2){
            $scope.inputIsShow = arg2==3?true:false;
            $scope.costomWorkNumEum[3].num = '';
            $scope.editLines = params.num;
        };
        /*设置每次作业的条数*/
        $scope.setInputValue = function(params){
            $scope.costomWorkNumEum[3].num = parseInt(params);
            if(!(/^[0-9]*[1-9][0-9]*$/.test(params))){
                swal('提示','必须大于零的整数!','warning');
                return;
            }else{
                $scope.editLines = parseInt(params);
            }
            $scope.popoverIsOpen = false;
        };

        $scope.batchParam = {
            value : "",
            batchField : "",
            replaceTo : ""
        };
        $scope.replaceOpt = [
            {"id": "province", "label": "省名"},
            {"id": "city", "label": "市名"},
            {"id": "county", "label": "区县名"},
            {"id": "town", "label": "乡镇街道名"},
            {"id": "place", "label": "地名小区名"},
            {"id": "street", "label": "街巷名"},
            {"id": "landmark", "label": "标志物名"},
            {"id": "prefix", "label": "前缀"},
            {"id": "housenum", "label": "门牌号"},
            {"id": "type", "label": "类型名"},
            {"id": "subnum", "label": "子号"},
            {"id": "surfix", "label": "后缀"},
            {"id": "estab", "label": "附属设施名"},
            {"id": "building", "label": "楼栋号"},
            {"id": "floor", "label": "楼层"},
            {"id": "unit", "label": "楼门号"},
            {"id": "room", "label": "房间号"},
            {"id": "addons", "label": "附加信息"}
        ];

        var searchOpt = [
            {"id": "name11Chi", "label": "官方标准中文名称"},
            {"id": "fullname", "label": "地址全称"}
        ];
        $scope.batchTabs = function(flag){
            $scope.batchFlag = flag;
            if(1 == flag){
                $scope.batchOpt = $scope.replaceOpt;
                $scope.batchParam.batchField = "province";
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
        $scope.searchWork = function(){
            if($scope.batchParam.value == ""){
                swal("请先输入搜索内容", "", "info");
                return;
            }
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
                if(areaFlag == "CHI"){ //大陆
                    currentValue = editArr[item]['addressChi'][$scope.batchParam.batchField];
                } else if(areaFlag == "CHT") { //港澳
                    currentValue = editArr[item]['addressCht'][$scope.batchParam.batchField];
                }
                if(currentValue && currentValue.indexOf($scope.batchParam.value)!= -1){
                    resultArr.push(editArr[item]);
                }
            }
            if(resultArr.length == 0){
                swal("当前没有符合条件的数据", "", "info");
                return;
            }
            $scope.getPerPageEditData(resultArr);
            $scope.editPanelIsOpen = true;
            initEditTable();
            $scope.batchWorkIsOpen = false;
        };
        $scope.extractData = function(){
            $scope.searchWork();
            $scope.editBatchWorkIsOpen = true;
            $scope.editDisable = true;

        };
        //获取当前页要编辑的条数
        $scope.getPerPageEditData = function(allData){
            //需要编辑的所有数据
            $scope.editAllDataList = allData;
            if($scope.editAllDataList.length > $scope.editLines){
                //当前页要编辑的数据
                var resultArr = $scope.editAllDataList.splice(0,$scope.editLines);
                $scope.currentEditOrig = angular.copy(resultArr);
                $scope.currentEdited = angular.copy(resultArr);
            }else{
                $scope.currentEditOrig = angular.copy($scope.editAllDataList);
                $scope.currentEdited = angular.copy($scope.editAllDataList);
            }
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
            { field: "surfix", title: "后缀",getValue: getColName,html:true,show: true},
            { field: "estab", title: "附属设施名",getValue: getColName,html:true,show: true,width:'80'},
            { field: "building", title: "楼栋名",getValue: getColName,html:true,show: true},
            { field: "floor", title: "楼层",getValue: getColName,html:true,show: true},
            { field: "unit", title: "楼门号",getValue: getColName,html:true,show: true},
            { field: "room", title: "房间号",getValue: getColName,html:true,show: true},
            { field: "addons", title: "附加",getValue: getColName,html:true,show: true},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true}
        ];

        var html = "";
        if( areaFlag == 'CHI'){ //测试用，大陆数据
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
            $scope.editBatchWorkIsOpen = false;
            //_self.tableParams.reload();
        };

        $scope.showView = function (row){
            $scope.showInfo =  row;
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
        $scope.editBatchWork = function(){
            $scope.editBatchWorkIsOpen = true;
            $scope.editDisable = false;
            $scope.batchParam.value = "";
            $scope.batchParam.replaceTo = "";
        };
        $scope.changeEditModel = function (val){
            $scope.editModelRadio = val;
        };
        $scope.closeEditBatchModal = function(){
            $scope.editBatchWorkIsOpen = false;
        };
        $scope.replaceAll = function(){
            var data = $scope.currentEdited;
            var i = 0 ;
            var currentValue;
            for(var item in data){
                var language = "";
                if(areaFlag == "CHI"){ //大陆
                    language = 'addressChi';
                } else if(areaFlag == "CHT") { //港澳
                    language = 'addressCht';
                }
                currentValue = data[item][language][$scope.batchParam.batchField];
                if(currentValue && currentValue.indexOf($scope.batchParam.value) != -1){
                    i++;
                    var finalyValue= currentValue.split($scope.batchParam.value).join($scope.batchParam.replaceTo);
                    data[item][language][$scope.batchParam.batchField] = finalyValue;
                }
            }
            swal("全部替换完成,共进行了"+i+"处替换", "", "info");
            //initEditTable();
//        	$scope.closeEditBatchModal();
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