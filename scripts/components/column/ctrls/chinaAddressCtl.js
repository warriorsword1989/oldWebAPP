/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('ChinaAddressCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var _self = $scope;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交

        $scope.chageTabs = function (flag){
            $scope.workedFlag = flag;

        };


        //初始化ng-table表头;

        // function htmlValue($scope, row) {
        //     var html = "<input type='checkbox'>";
        //     return $sce.trustAsHtml(html);
        // }

        $scope.testType = [
            {"id": 0, "label": "未调查"},
            {"id": 1, "label": "限速摄像头"},
            {"id": 2, "label": "雷达测速摄像头"}
        ];
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'勾选', show: true,width:'50px'},
            { field: "num_index", title: "序号", show: true},
            { field: "operateType", title: "作业类型",getValue:rendeOperType,show: true},
            { field: "nameGroupid", title: "名称组ID", show: true},
            { field: "names", title: "道路名称",getValue: getNames, show: true},
            { field: "radios", title: "测试单选",getValue: testRadio, show: true},
            { field: "base", title: "基本名称", show: true,getValue: renderedInput,inputType: "text"},
            { field: "processFlag", title: "标示", show: true,getValue: renderedInput,inputType: "number"},
            { field: "codeType", title: "标示", show: true,getValue: renderedSelect}
        ];

        function getNames($scope, row){
            var html = "";
            //输入一个字母就会重新绘制input框
            // html = '<div ng-repeat="simpleName in row[col.field]">' +
            //     '<input type="text" ng-model="row[col.field][$index]" class="form-control input-sm table-input" >' +
            //     '</div>';

            //无作用
            // html = '<div ng-repeat="simpleName in row[col.field]">' +
            //     '<input type="text" ng-model="simpleName" class="form-control input-sm table-input" >' +
            //     '</div>';
            //html += '<button type="button" >增   加</button>';
            for(var i = 0 ,len = row.names.length; i < len; i++){
                // html += "<input type='" + this.inputType + "' class='form-control input-sm table-input' " +
                //    "title='{{row[col.field][0]}}' ng-model='row[col.field]["+i+"]' />";

                var ht = '<div class="input-group" style="padding-bottom: 3px;">'
                    +'<input type="' + this.inputType + '" class="form-control input-sm table-input"'
                    +'title="{{row[col.field][0]}}" ng-model="row[col.field]['+i+']" />'
                    +'<span class="input-group-btn">'
                    +'<button type="button" class="btn btn-primary btn-xs" ng-click="deleteNames(row,'+i+')" style="padding-bottom: 3px;">-</button>'
                    +'<button type="button" class="btn btn-primary btn-xs" ng-click="addNames(row)" style="padding-bottom: 3px;">+</button>'
                    +'</span>'
                    +'</div>';
                html += ht;
            }
            return html;
        }
        $scope.addNames = function(row){
            row.names.push("测试名称");
        };
        $scope.deleteNames = function(row,i){
            row.names.splice(i,1);
        };
        function testRadio($scope, row){
            var html = '<label class="radio-inline"><input type="radio" ng-click="radioClick(this);" ng-model="row[col.field][0]" name="testRadio" value="row[col.field][0]">1</label>'
                +'<label class="radio-inline"><input type="radio" ng-click="radioClick(this);" ng-model="row[col.field][1]"  name="testRadio" value="row[col.field][1]">2</label>'
                +'<label class="radio-inline"><input type="radio" ng-click="radioClick(this);" ng-model="row[col.field][2]"  name="testRadio" value="row[col.field][2]">3</label>';
            return html;
        }
        $scope.radioClick = function (t){
            console.info(t);
        };
        function rendeOperType($scope, row){
            var type = row.operateType;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>'
            }
            return html;
        }
        function renderedInput($scope, row) {
            var html = "<input type='" + this.inputType + "' class='form-control input-sm table-input' title='{{row[col.field]}}' ng-model='row[col.field]' />";
            return html;
        }
        function renderedSelect($scope, row){
            var html = "<select ng-model='row[col.field]' class='form-control table-input' ng-options='value.id as value.label for value in testType'> </select>"
            return html;
        }

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
        //刷新表格方法;
        var refreshData = function() {
            _self.tableParams.reload();
        };
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
                    dsMeta.roadNameList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        $scope.roadNameList = data.data;
                        _self.tableParams.total(data.total);
                        $defer.resolve(data.data);
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
                data.radios = [1,2,3];
                if(true){ //这是测试数据 ,可以删掉
                    if(index%2){
                        data.codeType = 2;
                        data.operateType = ["未名称统一POI作业"];
                        data.names = ['名称','一中'];
                    } else {
                        data.codeType = 1;
                        data.operateType = ["未名称统一POI作业","名称统一POI作业"];
                        data.names = ['测试'];
                    }
                }
            });
        });
        /*初始化方法*/
        initRoadNameTable();
    }
]);