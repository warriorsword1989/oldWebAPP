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
            initEditorTable();
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

        /**************** 工具条begin ***************/
        $scope.submitData = function (){
            $scope.editDataList = $scope.editDataList.reverse();
            _self.editorTable.reload();
        };
        /**************** 工具条end   ***************/

        /*******************  编辑页面begin  ****************/
        $scope.editor = {};
        $scope.editor.editorCols = [
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true,width:'100'},
            { field: "addressFullname", title: "地址全称",getValue: getFullName, show: true,width:'100'},
            { field: "province", title: "省名",getValue: getProvince,html:true,show: true},
            { field: "city", title: "市名",getValue: getCity,html:true,show: true},
            { field: "county", title: "区县名",getValue: getCounty,html:true,show: true},
            { field: "town", title: "乡镇街道办",getValue: getTown,html:true,show: true,width:'80'},
            { field: "place", title: "地区小区名",getValue: getPlace,html:true,show: true,width:'80'},
            { field: "street", title: "街巷名",getValue: getStreet,html:true,show: true},
            { field: "landmark", title: "标志物名",getValue: getLandmark,html:true,show: true},
            { field: "prefix", title: "前缀",getValue: getPrefix,html:true,show: true},
            { field: "housenum", title: "门牌号",getValue: getHousenum,html:true,show: true},
            { field: "type", title: "类型名",getValue: getType,html:true,show: true},
            { field: "subnum", title: "字号",getValue: getSubnum,html:true,show: true},
            { field: "subfix", title: "后缀",getValue: getSubfix,html:true,show: true},
            { field: "estab", title: "附属设施名",getValue: getEstab,html:true,show: true,width:'80'},
            { field: "building", title: "楼栋名",getValue: getBuilding,html:true,show: true},
            { field: "floor", title: "楼层",getValue: getFloor,html:true,show: true},
            { field: "unit", title: "楼门号",getValue: getUnit,html:true,show: true},
            { field: "room", title: "房间号",getValue: getRoom,html:true,show: true},
            { field: "addons", title: "附加",getValue: getAddons,html:true,show: true},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true}
        ];

        $scope.test = function (){
            console.info("++",$scope.editorTable);
        };
        var html = "";
        if('CHI' == 'CHI'){ //测试用，大陆数据
            html = "<input type='text' class='form-control input-sm table-input' title='{{row[col.field]}}' value='row[col.field]' ng-model='row.addressChi[col.field]' />";
        }
        function getProvince($scope,row){ return html;
        }
        function getCity($scope,row){ return html;
        }
        function getCounty($scope,row){ return html;
        }
        function getTown($scope,row){ return html;
        }
        function getPlace($scope,row){ return html;
        }
        function getStreet($scope,row){  return html;
        }
        function getLandmark($scope,row){ return html;
        }
        function getPrefix($scope,row){ return html;
        }
        function getHousenum($scope,row){ return html;
        }
        function getType($scope,row){ return html;
        }
        function getSubnum($scope,row){  return html;
        }
        function getSubfix($scope,row){ return html;
        }
        function getEstab($scope,row){ return html;
        }
        function getBuilding($scope,row){  return html;
        }
        function getFloor($scope,row){ return html;
        }
        function getUnit($scope,row){ return html;
        }
        function getRoom($scope,row){ return html;
        }
        function getAddons($scope,row){ return html;
        }
        function getDetails($scope,row){
            return '<span class="badge pointer">查看</span>';
        }



        function initEditorTable() {
            _self.editorTable = new NgTableParams({
            }, {
                counts:[],
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
            //initEditorTable();
        }
        initPage();
    }
]);