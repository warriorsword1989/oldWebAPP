/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('AddrePinyinCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editorLines = 2; //每页编辑的条数
        $scope.editorCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = []; //查询列表数据
        $scope.currentEditOrig = []; //当前编辑的数据原始值
        $scope.currentEdited = []; //当前编辑的数据

        var languageFlag = '';
        if(true){
            languageFlag = "addressChi";
        }

        $scope.chageTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'40px'},
            { field: "classifyRules", title: "作业类型",getValue:getClassifyRules,show: true,width:'80px'},
            { field: "classifyRules", title: "分类",getValue:getKindName,show: true,width:'80px'},
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true,width:'180px'},
            { field: "addressCombineName", title: "中文地址合并",getValue: getCombineName, html:true,width:'220px',show: true},
            { field: "addressCombinePinyin", title: "拼音地址合并",getValue: getCombinePinyin,html:true,width:'220px', show: true},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function getNames($scope, row){
            return row.name11Chi.name;
        }
        function getFullName($scope, row){
            return row.addressChi.fullName;
        }
        function getKindName($scope, row){
            return $scope.metaData.kindFormat[row.kindCode].kindName;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>'
            }
            return html;
        }

        function getCombineName($scope, row){
            if(row[languageFlag]['roadname'] && row[languageFlag]['addrname']){
                var html = $scope.heightLightCn(row[languageFlag]['roadname'],row[languageFlag]['roadNameMultiPinyin']) +'|'+ $scope.heightLightCn(row[languageFlag]['addrname'],row[languageFlag]['addrNameMultiPinyin']);
                return "<span>"+html+"<span>";
            }else if(row['roadname']){
                var html = $scope.heightLightCn(row[languageFlag]['roadname'],row[languageFlag]['roadNameMultiPinyin']);
                return "<span>"+html+"<span>";
            }else if(row['roadname']){
                var html = $scope.heightLightCn(row[languageFlag]['roadname'],row[languageFlag]['addrNameMultiPinyin']);
                return "<span>"+html+"<span>";
            }
            return "";
        }
        
        function getCombinePinyin($scope, row){
            var roadnamepinyin = row[languageFlag]['roadNamePinyin'];
            var addrnamepinyin = row[languageFlag]['addrNamePinyin'];
            if(roadnamepinyin && addrnamepinyin){
                roadnamepinyin = roadnamepinyin.replace(/\s/g,' ');
                var roadnameV = $scope.heightLightPinAddress(roadnamepinyin.replace(/\|/g,' | '), row[languageFlag]['roadname'], row[languageFlag]['roadNameMultiPinyin'],"road");
                roadnameV = roadnameV.replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                addrnamepinyin = addrnamepinyin.replace(/\s/g,' ');
                var addrnameV = $scope.heightLightPinAddress(addrnamepinyin.replace(/\|/g,' | '), row[languageFlag]['addrname'], row[languageFlag]['addrNameMultiPinyin'],"addr");
                addrnameV = addrnameV.replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                return "<span>"+roadnameV +"|"+ addrnameV+"</span>";
            }else if(roadnamepinyin){
                roadnamepinyin = roadnamepinyin.replace(/\s/g,' ');
                var roadnameV = $scope.heightLightPinAddress(roadnamepinyin.replace(/\|/g,' | '), row[languageFlag]['roadname'], row[languageFlag]['roadNameMultiPinyin'],"road");
                roadnameV = roadnameV.replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                return "<span>"+roadnameV+"</span>";
            }else if(addrnamepinyin){
                addrnamepinyin = addrnamepinyin.replace(/\s/g,' ');
                var addrnameV = $scope.heightLightPinAddress(addrnamepinyin.replace(/\|/g,' | '), row[languageFlag]['addrname'], row[languageFlag]['addrNameMultiPinyin'],"addr");
                addrnameV = addrnameV.replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                return "<span>"+addrnameV+"</span>";
            }
            return "";
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

        /**************** 工具条begin ***************/
        $scope.submitData = function (){
            _self.editorTable.reload();
        };
        $scope.saveData = function (){
            //获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
            console.info(chage);
            //调用接口
        };
        /**************** 工具条end   ***************/

        /*******************  编辑页面begin  ****************/
        $scope.editor = {};
        $scope.editor.editorCols = [
            { field: "classifyRules", title: "作业类型",getValue:getClassifyRules,show: true,width:'80px'},
            { field: "classifyRules", title: "分类",getValue:getKindName,show: true,width:'50px'},
            { field: "name11Chi", title: "官方标准化中文名称",getValue:getNames,show: true,width:'180px'},
            { field: "addressCombineName", title: "中文地址合并",getValue: getCombineName, html:true,show: true,width:'240px'},
            { field: "addressCombinePinyin", title: "拼音地址合并",getValue: getCombinePinyin,html:true, show: true,width:'280px'},
            { field: "referenceInfo", title: "参考信息",getValue: getReferenceInfo,html:true, show: true,width:'100px'},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true}
        ];

        var html = "";
        if('CHI' == 'CHI'){ //测试用，大陆数据
            html = "<input type='text' class='form-control input-sm table-input' title='{{row[col.field]}}' value='row[col.field]' ng-model='row.addressChi[col.field]' />";
        }

        function getDetails($scope,row){
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }
        function getReferenceInfo($scope,row){
            var roadNamePinyin = row[languageFlag]["roadNameMultiPinyin"];
            var html = "";
            for (var i = 0 ,len = roadNamePinyin.length; i < len; i ++){
                var yin = roadNamePinyin[i].toString();
                var str = yin.substr(yin.indexOf(",") + 3);
                var pinyinArr = str.split(',');
                for (var j = 0 ,le = pinyinArr.length; j < le; j++){
                    if(pinyinArr[j] == $scope.radioDefaultValRoad[i]){
                        html += pinyinArr[j]+'<input type="radio" checked="checked" value="'+pinyinArr[j]+"_"+i+'_road" name="piyin_0_'+i+row.rowId+'" ng-click="chagePinyin(row,$event);">';
                    } else {
                        html += pinyinArr[j]+'<input type="radio" value="'+pinyinArr[j]+"_"+i+'_road" name="piyin_0_'+i+row.rowId+'" ng-click="chagePinyin(row,$event);">';
                    }
                }
                html += '<br>';
            }
            var addrNamePinyin = row[languageFlag]["addrNameMultiPinyin"];
            for (var i = 0 ,len = addrNamePinyin.length; i < len; i ++){
                var yin = addrNamePinyin[i].toString();
                var str = yin.substr(yin.indexOf(",") + 3);
                var pinyinArr = str.split(',');
                for (var j = 0 ,le = pinyinArr.length; j < le; j++){
                    if(pinyinArr[j] == $scope.radioDefaultValAddr[i]){
                        html += pinyinArr[j]+'<input type="radio" checked="checked" value="'+pinyinArr[j]+"_"+i+'_addr" name="piyin_1_'+i+row.rowId+'" ng-click="chagePinyin(row,$event);">';
                    } else {
                        html += pinyinArr[j]+'<input type="radio" value="'+pinyinArr[j]+"_"+i+'_addr" name="piyin_1_'+i+row.rowId+'" ng-click="chagePinyin(row,$event);">';
                    }
                }
                html += '<br>';
            }
            return '<span>'+html+'</span>';
        }

        $scope.chagePinyin = function (row,e){
            var value = e.target.value;
            var valueStr = value.split("_");
            var pinyin = valueStr[0];
            var index = valueStr[1];
            var flag = valueStr[2];


            var roadnamepinyin = row[languageFlag]['roadNamePinyin'];
            if(roadnamepinyin && flag == 'road'){
                roadnamepinyin = roadnamepinyin.replace(/\|/g,' | ').replace(/\s+/g,' ');
                if(roadnamepinyin.substr(0,1) == " "){
                    roadnamepinyin = roadnamepinyin.substr(1);
                }

                var roadname = row[languageFlag]['roadname'];
                var roadNameMultiPinyin = row[languageFlag]['roadNameMultiPinyin'];
                var indexArr = $scope.calculateIndex(roadnamepinyin,roadname,roadNameMultiPinyin);

                roadnamepinyin = roadnamepinyin.replace(/\s+/g,' ');
                var temp = roadnamepinyin.split(" ");
                temp[indexArr[index]] = pinyin;
                temp = temp.join(" ").replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                row[languageFlag]['roadNamePinyin'] = temp;
            }
            var addrnamepinyin = row[languageFlag]['addrNamePinyin'];
            if(addrnamepinyin && flag == 'addr'){
                addrnamepinyin = addrnamepinyin.replace(/\|/g,' | ').replace(/\s+/g,' ');
                if(addrnamepinyin.substr(0,1) == " "){
                    addrnamepinyin = addrnamepinyin.substr(1);
                }
                var addrname = row[languageFlag]['addrname'];
                var addrNameMultiPinyin = row[languageFlag]['addrNameMultiPinyin'];
                var indexArr = $scope.calculateIndex(addrnamepinyin,addrname,addrNameMultiPinyin);

                //addrnamepinyin = addrnamepinyin;
                var temp = addrnamepinyin.split(" ");
                temp[indexArr[index]] = pinyin;
                temp = temp.join(" ").replace(/(\s\|\s)/g,'|').replace(/(\|\s)/g,'|');
                row[languageFlag]['addrNamePinyin'] = temp;
            }
        };



        function initEditorTable() {
            _self.editorTable = new NgTableParams({
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
            //initEditorTable();
        }
        initPage();
    }
]);