/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('NameUnifyCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
		var objCtrl = fastmap.uikit.ObjectEditController();
		var _self = $scope;
        $scope.editPanelIsOpen = false;
        $scope.batchWorkIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editorLines = 2; //每页编辑的条数
        $scope.editorCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = []; //查询列表数据
        $scope.currentEditOrig = []; //当前编辑的数据原始值
        $scope.currentEdited = []; //当前编辑的数据
        
        $scope.changeTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "kind", title: "分类",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "name12Chi", title: "官方原始名称",getValue:get11Names,show: true},
            { field: "name11Chi", title: "官方标准化中文名称",getValue:get12Names,show: true},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function get11Names($scope, row){
            return row.name11Chi.name;
        }
        function get12Names($scope, row){
        	return row.name12Chi.name;
        }
        function getFullName($scope, row){
            return row.addressChi.fullName;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
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
            var editorArr = [];
            if(checkedArr.length > 0){
                editorArr = checkedArr;
            } else {
                editorArr = $scope.tableParams.data.slice(0,$scope.editorLines);
            }
            console.info(editorArr);
            $scope.editAllDataList = $scope.tableParams.data;
            $scope.currentEditOrig = angular.copy(editorArr);
            $scope.currentEdited = angular.copy(editorArr);
            $scope.editPanelIsOpen = true;
            initEditorTable();
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
        function initTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: $scope.filter
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
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.checked = false;//默认增加checked属性
            });
        });

        /**************** 工具条begin ***************/
        $scope.submitData = function (){
            _self.editorTable.reload();
        };
        $scope.saveData = function (){
        	console.log("原始数据：")
        	console.log($scope.currentEditOrig);
        	console.log("编辑后的数据")
        	console.log($scope.currentEdited);
            //获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
            console.info(chage);
            //调用接口

        };
        $scope.batchParam = {
        	value : "",
        	batchField : ""
        };
        var replaceOpt = [
            {"id": "name12Chi", "label": "官方标准中文名称"}
        ];
        		
        var searchOpt = [
        	{"id": "name12Chi", "label": "官方标准中文名称"},
        	{"id": "name11Chi", "label": "官方原始中文名称"}	
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
        $scope.searchWork = function(){
        	if($scope.batchParam.value == ""){
        		swal("请先输入搜索内容", "", "info");
				return;
        	}
        	var temp = $scope.tableParams.data;
            var checkedArr = [];
            for (var i = 0 ,len = temp.length ;i < len ; i ++){
                if(temp[i].checked){
                    checkedArr.push(temp[i]);
                }
            }
            var editorArr = [];
            if(checkedArr.length > 0){
                editorArr = checkedArr;
            } else {
                editorArr = $scope.tableParams.data;
            }
            console.log('--'+JSON.stringify(editorArr))
            var currentValue;
            for(var item in editorArr){
            	currentValue = editorArr[item][$scope.batchParam.batchField].name;
                if(currentValue && currentValue.indexOf($scope.batchParam.value)!= -1){
    			}
    		}
        };
        /**************** 工具条end   ***************/

        /*******************  编辑页面begin  ****************/
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



        function initEditorTable() {
            _self.editorTable = new NgTableParams({
            }, {
                counts:[],
                dataset: $scope.currentEdited
            });
        };

        $scope.closeEditPanel = function (){
            $scope.editPanelIsOpen = false;
            $scope.showImgInfoo = false;
            _self.tableParams.reload();
        };
        
        $scope.showView = function (){
            $scope.showImgInfoo = true;
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
            $scope.showImgInfoo = false;
        };
        /*******************  编辑页面end  ******************/

        /*初始化方法*/
        function initPage(){
        	initTable();
            //initEditorTable();
        }
        initPage();
    }
]);