/**
 * Created by mali on 2016-9-02
 */
angular.module('app').controller('ShortNameCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', '$document', 'appPath', '$interval', '$timeout', 'dsMeta', '$compile', '$attrs', 'dsColumn',
    function ($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, $document, appPath, $interval, $timeout, dsMeta, $compile, $attrs, dsColumn) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        $scope.editPanelIsOpen = false;
        /* 初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editorLines = 10; // 每页编辑的条数
        $scope.editorCurrentPage = 1; // 当前编辑的页码
        $scope.editAllDataList = []; // 要编辑的列表总数据
        $scope.tableDataList = new Array();// 存储查询列表数据
        $scope.currentEditOrig = []; // 当前编辑的数据原始值
        $scope.currentEdited = []; // 当前编辑的数据

        // popover
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNumEum = [{num: 10, desc: '每次10条'}, {num: 20, desc: '每次20条'}, {
            num: 30,
            desc: '每次30条'
        }, {num: '', desc: '自定义'}];

        $scope.changeTabs = function (flag) {
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            {field: 'selector', headerTemplateURL: 'headerCheckboxId', title: '选择', show: true, width: '60px'},
            {field: 'classifyRules11', title: '作业类型', getValue: getClassifyRules, show: true, width: '150px'},
            {field: 'kindCodeName', title: '分类', show: true, width: '150px'},
            {field: 'name11Chi', title: '官方标准中文名称', getValue: get11Name, show: true},
            {field: 'name51ChiArr', title: '简称', getValue: get51name, show: true},
            {field: 'pid', title: 'PID', show: false, width: '100px'}
        ];

        function get11Name($scope, row) {
            return row.name11Chi.name;
        }

        function get51name($scope, row) {
            var namestrArr = [];
            if (row.name51ChiArr.length > 0) {
                for (var i = 0; i < row.name51ChiArr.length; i++) {
                    namestrArr.push(row.name51Chi.name);
                }
            }
            return namestrArr.join(',');
        }

        function getClassifyRules($scope, row) {
            var type = row.classifyRules.split(',');
            var html = '';
            for (var i = 0; i < type.length; i++) {
                html += '<span class="badge">' + type[i] + '</span>';
            }
            return html;
        }

        $scope.selectData = function (row, index) {
            var temp = $scope.tableDataList;
            var checkedArr = [];
            for (var i = 0, len = temp.length; i < len; i++) {
                if (temp[i].checked) {
                    checkedArr.push(temp[i]);
                }
            }
            var editorArr = [];
            if (checkedArr.length > 0) {
                editorArr = checkedArr;
            } else {
                editorArr = $scope.tableDataList;
            }
            $scope.getPerPageEditData(editorArr);
            $scope.editPanelIsOpen = true;
            initEditTable();
        };
        $scope.searchType = 'name';

        // 表格配置搜索;
        $scope.filter = {
            name: '',
            nameGroup: '',
            admin: '',
            sql: ''
        };
        // 接收高级查询过滤条件
        $scope.$on('FITERPARAMSCHANGE', function (event, data) {
            $scope.filter.name = data.name;
            $scope.filter.nameGroup = data.nameGroupid;
            $scope.filter.admin = data.admin;
            $scope.filter.sql = data.sql;
        });
        function initTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: $scope.filter
            }, {
                counts: [],
                getData: function ($defer, params) {
                    var param = {
                        type: 'integrate',
                        firstWorkItem: 'poi_name',
                        secondWorkItem: 'shortName',
                        status: 1
                    };
                    dsColumn.queryColumnDataList(param).then(function (data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        var temp = new FM.dataApi.ColPoiList(data);
                        $scope.tableDataList = new FM.dataApi.ColPoiList(data).dataList;
                        _self.tableParams.total(data.total);
                        $defer.resolve(temp.dataList);
                    });
                }
            });
        }

        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            $scope.tableParams.data.checkedAll = false;
            $scope.itemActive = -1;
            angular.forEach($scope.tableDataList, function (data, index) {
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.checked = false;// 默认增加checked属性
            });
        });

        /** ************** 工具条begin ***************/
        $scope.submitData = function () {
            _self.editorTable.reload();
        };
        $scope.saveData = function () {
            // 获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditOrig, $scope.currentEdited);
            console.info(chage);
            // 调用接口
            if ($scope.editAllDataList.length <= $scope.editorLines) {
                swal('已经是最后一页了!', '', 'info');
            }
            $scope.getPerPageEditData($scope.editAllDataList);
            initEditTable();
        };
        // 获取当前页要编辑的条数
        $scope.getPerPageEditData = function (allData) {
            // 需要编辑的所有数据
            $scope.editAllDataList = allData;
            if ($scope.editAllDataList.length > $scope.editorLines) {
                // 当前页要编辑的数据
                var resultArr = $scope.editAllDataList.splice(0, $scope.editorLines);
                $scope.currentEditOrig = angular.copy(resultArr);
                $scope.currentEdited = angular.copy(resultArr);
            } else {
                $scope.currentEditOrig = angular.copy($scope.editAllDataList);
                $scope.currentEdited = angular.copy($scope.editAllDataList);
            }
        };
        // 设置每次作业条数的radio选择逻辑;
        $scope.selectNum = function (params, arg2) {
            $scope.inputIsShow = arg2 == 3 ? true : false;
            $scope.costomWorkNumEum[3].num = '';
            $scope.editorLines = params.num;
        };
        /* 设置每次作业的条数*/
        $scope.setInputValue = function (params) {
            $scope.costomWorkNumEum[3].num = parseInt(params);
            if (params <= 0) {
                alert('必须大于零的整数!');
                return;
            } else {
                $scope.editorLines = parseInt(params);
            }
            $scope.popoverIsOpen = false;
        };
        /** ************** 工具条end   ***************/

        /** *****************  编辑页面begin  ****************/
        $scope.editor = {};
        $scope.editor.editorCols = [
//            { field: "num_index", title: "序号",show: true,width:'20px'},
            {field: 'classifyRules11', title: '作业类型', getValue: getClassifyRules, show: true, width: '50px'},
            {field: 'kindCodeName', title: '分类', show: true, width: '50px'},
            {field: 'name11Chi', title: '官方标准中文名称', getValue: get11Name, show: true, width: '50px'},
            {
                field: 'name51ChiArr',
                title: '简称',
                getValue: getName,
                show: true,
                html: true,
                width: '80px',
                inputType: 'text'
            },
            {field: 'refMsg', title: '参考信息', show: true, width: '50px'},
            {field: 'details', title: '详情', getValue: getDetails, html: true, show: true, width: '30px'}
        ];
        var html = '';
        if ('CHI' === 'CHI') { // 测试用，大陆数据
            html = "<input type='text' class='form-control input-sm table-input' title='{{row.name11Chi.name}}' value='row.name11Chi.name' ng-model='row.name11Chi.name' />";
        }
        function getName($scope, row) {
            var html = '';
            for (var i = 0, len = row.name51ChiArr.length; i < len; i++) {
                var ht = '<div class="input-group" style="padding-bottom: 3px;">'
                    + '<input type="' + this.inputType + '" class="form-control input-sm table-input"'
                    + 'title="{{row.name51ChiArr[' + i + '].name}}" ng-model="row.name51ChiArr[' + i + '].name" />'
                    + '<span class="input-group-btn">'
                    + '<button type="button" class="btn btn-xs btn-shape" ng-click="deleteNames(row,' + i + ')" style="padding-bottom: 3px;">-</button>'
                    + '<button type="button" class="btn btn-xs btn-shape" ng-click="addNames(row)" style="padding-bottom: 3px;">+</button>'
                    + '</span>'
                    + '</div>';
                html += ht;
            }
            return '<span>' + html + '</span>';
        }

        var new51ObjData = {
            langCode: 'CHI',
            nameClass: 5,
            nameType: 1
        };
        var new51Obj = new FM.dataApi.ColPoiName(new51ObjData);
        $scope.addNames = function (row) {
            row.name51ChiArr.push(angular.copy(new51Obj));
        };
        $scope.deleteNames = function (row, i) {
            row.name51ChiArr.splice(i, 1);
        };
        function getDetails($scope, row) {
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }

        $scope.closeEditPanel = function () {
            $scope.editPanelIsOpen = false;
            $scope.showImgInfoo = false;
            _self.tableParams.reload();
        };
        function initEditTable() {
            _self.editorTable = new NgTableParams({}, {
                counts: [],
                dataset: $scope.currentEdited
            });
        }

        $scope.showView = function (row) {
            $scope.showInfo = row;
            $scope.showImgInfoo = true;
            $scope.slides = [
                {
                    id: 1,
                    image: '../../../images/poi/main/test.png',
                    text: '111'
                }, {
                    id: 2,
                    image: '../../../images/poi/main/test.png',
                    text: '222'
                }, {
                    id: 3,
                    image: '../../../images/poi/main/test.png',
                    text: '333'
                }
            ];
        };
        $scope.closeView = function () {
            $scope.showImgInfoo = false;
        };
        /** *****************  编辑页面end  ******************/
        /* 初始化方法*/
        function initPage() {
            initTable();
        }

        initPage();
    }
]);
