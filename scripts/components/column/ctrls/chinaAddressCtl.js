/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('ChinaAddressCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var _self = $scope;
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editorLines = 10;

        $scope.chageTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true},
            { field: "addressFullname", title: "地址全称",getValue: getFullName, show: true},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function getNames($scope, row){
            return row.name11Chi.name;
        }
        function getFullName($scope, row){
            return row.addressChi.fullName;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>'
            }
            return html;
        }
        $scope.editDataList = [];
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
            console.info($scope.tableParams.data);
            $scope.editDataList = editorArr;
            $scope.editPanelIsOpen = true;
        };

        $scope._test = function (){
            console.info($scope.tableParams.data);
            $scope.tableParams.data[0].names = ['s','vv','22'];
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
                    var param = {
                        subtaskId: parseInt(App.Temp.subTaskId),
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                        params:{"name":params.filter().name,"nameGroupid":params.filter().nameGroup,"admin":params.filter().admin,"sql":params.filter().sql}
                    };
                    // dsMeta.roadNameList(param).then(function(data) {
                    //     $scope.loadTableDataMsg = '列表无数据';
                    //     $scope.roadNameList = data.data;
                    //     _self.tableParams.total(data.total);
                    //     $defer.resolve(data.data);
                    // });

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

        /*******************  编辑页面begin  ****************/
        $scope.editor = {};
        $scope.editor.editorCols = [
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true,width:'100'},
            { field: "addressFullname", title: "地址全称",getValue: getFullName, show: true,width:'100'},
            { field: "province", title: "省名",show: true},
            { field: "city", title: "市名",show: true},
            { field: "county", title: "区县名",show: true},
            { field: "town", title: "乡镇街道办",show: true},
            { field: "place", title: "地区小区名",show: true},
            { field: "street", title: "街巷名",show: true},
            { field: "landmark", title: "标志物名",show: true},
            { field: "prefix", title: "前缀",show: true},
            { field: "housenum", title: "门牌号",show: true},
            { field: "type", title: "类型名",show: true},
            { field: "subnum", title: "字号",show: true},
            { field: "subfix", title: "后缀",show: true},
            { field: "estab", title: "附属设施名",show: true},
            { field: "building", title: "楼栋名",show: true},
            { field: "floor", title: "楼层",show: true},
            { field: "unit", title: "楼门号",show: true},
            { field: "room", title: "房间号",show: true},
            { field: "addons", title: "附加",show: true},
            { field: "details", title: "详情",show: true}
        ];
        function initEditorTable() {
            _self.editorTable = new NgTableParams({
            }, {
                dataset: $scope.editDataList
            });
        };

        $scope.closeEditPanel = function (){
            $scope.editPanelIsOpen = false;
            _self.tableParams.reload();
        };

        /*******************  编辑页面end  ******************/

        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
            initEditorTable();
        }
        initPage();
    }
]);