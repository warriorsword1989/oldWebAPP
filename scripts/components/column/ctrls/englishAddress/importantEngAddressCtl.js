/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('importantEngAddressCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce','$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce,$document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editLines = 2; //每页编辑的条数
        $scope.editCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = []; //查询列表数据
        $scope.currentEditOrig = []; //当前编辑的数据原始值
        $scope.currentEdited = []; //当前编辑的数据
        $scope.costomWorkNumEum = [2,10,20,30];
        $scope.customPopoverUrl = 'myPopoverTemplate.html';

        var languageFlag = '';
        if(true){
            languageFlag = "addressEng";
        }

        $scope.chageTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "fullname", title: "全地址",getValue:getNames,show: true},
            { field: "addressCombine", title: "中文地址合并",getValue: getAddressCombine, show: true},
            { field: "engFullname", title: "英文地址全称",getValue: getEngFullname, show: true},
            //{ field: "engShortName", title: "英文地址简称", show: true},//简称实际是没有值的，在编辑界面如果简称有值，会将简称的值赋值给全称
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function getNames($scope, row){
            return row.name11Chi.name;
        }
        function getAddressCombine($scope, row){
            var addressCombine = "";
            //英文地址作业中，中文地址合并只显示后15个字段
            if(row[languageFlag]["roadname"] && row[languageFlag]["addrname"]){
                var roadname = row[languageFlag]["roadname"];
                roadname = roadname.split("|").splice(3).join("|"); //删除前三个字段
                addressCombine = roadname + '|' + row[languageFlag]["addrname"];
            } else if(row[languageFlag]["roadname"]){
                var roadname = row[languageFlag]["roadname"];
                roadname = roadname.split("|").splice(3).join("|"); //删除前三个字段
                addressCombine = roadname;
            } else if(row[languageFlag]["addrname"]){
                addressCombine = row[languageFlag]["addrname"];
            }
            return addressCombine;
        }
        function getEngFullname($scope, row){
            return row[languageFlag]["fullname"];
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
            $scope.currentEditOrig = angular.copy(editArr);
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
            //重要分类地址英文作业的特殊处理，如果有英文地址简称，需要将地址简称赋值给英文地址全程
            for (var i = 0 ,len = $scope.currentEdited.length; i < len ; i ++){
                var engShortName = $scope.currentEdited[i]["addressEng"].shortNameExtra;
                if(engShortName){
                    $scope.currentEdited[i]["addressEng"]["fullname"] = engShortName;
                }
            }
            //获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
            console.info(chage);
            //调用接口
        };
        /**************** 工具条end  ***************/

        /*******************  编辑页面begin  ****************/
        $scope.edit = {};
        $scope.edit.editCols = [
            { field: "classifyRules", title: "作业类型",getValue:getClassifyRules,show: true,width:'50px'},
            { field: "name", title: "全地址",getValue:getNames,show: true,width:'200px'},
            { field: "addressCombine", title: "中文地址合并",getValue: getAddressCombine, show: true,width:'200px'},
            { field: "fullname", title: "英文地址全称",getValue: getColName,html:true,show: true,width:'200px'},
            { field: "engFullnameLength", title: "字符数1",getValue: getFullnameLength,show: true,width:'50px'},
            { field: "shortNameExtra", title: "英文地址简称",getValue: getColName,html:true,show: true,width:'200px'},
            { field: "engFullnameLength", title: "字符数2",getValue: getShartNameLength,show: true,width:'50px'}, //简称实际是没有值的，在编辑界面如果简称有值，会将简称的值赋值给全称
            { field: "addrrefMsg", title: "参考信息",getValue: getAddrrefMsg,show: true,width:'200px'},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true}
        ];

        var html = "";
        if(languageFlag == 'addressEng'){
            html = "<input type='text' class='form-control input-sm table-input' title='{{row[col.field]}}' value='row[col.field]' ng-model='row.addressEng[col.field]' />";
        }
        function getColName($scope,row){
            return html;
        }
        function getFullnameLength($scope,row){
            return row[languageFlag]["fullname"].length;
        }
        function getShartNameLength($scope,row){
            return row[languageFlag]["shortNameExtra"].length;
        }
        function getAddrrefMsg($scope,row){
            var value = row[languageFlag]["addressList"];
            value = !value?[]:value;
            var str = "";
            for(var i = 0; i < value.length; i++ ){
                str += i+1+".英文中包含'"+value[i].split('&')[0]+"',对应简化为'"+value[i].split('&')[1]+"';<br>";
            }
            return str;
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


        /*******************  编辑页面end  ******************/

        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
            //initEditTable();
        }
        initPage();
    }
]);