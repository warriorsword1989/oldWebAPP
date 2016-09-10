/**
 * Created by mali on 2016-9-01
 */
angular.module('app').controller('NamePinyinCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs','dsColumn',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs,dsColumn) {
		var objCtrl = fastmap.uikit.ObjectEditController();
		var _self = $scope;
        $scope.editPanelIsOpen = false;
        /*初始化显示table提示*/
        $scope.loadTableDataMsg = '数据加载中...';
        $scope.workedFlag = 1; // 1待作业  2待提交
        $scope.editorLines = 10; //每页编辑的条数
        $scope.editorCurrentPage = 1; //当前编辑的页码
        $scope.editAllDataList = []; //要编辑的列表总数据
        $scope.currentEditOrig = []; //当前编辑的数据原始值
        $scope.tableDataList = new Array();//存储查询列表数据
        $scope.currentEdited = []; //当前编辑的数据
        //popover
        $scope.popoverIsOpen = false;
        $scope.customPopoverUrl = 'myPopoverTemplate.html';
        $scope.costomWorkNumEum = [{'num':10,'desc':'每次10条'},{'num':20,'desc':'每次20条'},{'num':30,'desc':'每次30条'},{'num':'','desc':'自定义'}];
        
        $scope.changeTabs = function (flag){
            $scope.workedFlag = flag;
        };
        $scope.cols = [
            { field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "kind", title: "分类",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "nameObj", title: "名称",getValue:getName,show: true},
            { field: "nameObj", title: "拼音",getValue:getPinyin,show: true},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];

        function getName($scope, row){
            var html = $scope.heightLightCn(row.nameObj.name,row.nameObj.multiPinyin);
            return "<span>"+html+"<span>";
        }
        function getPinyin($scope, row){
	        var html = $scope.heightLightPin(row.nameObj.namePhonetic,row.nameObj.name,row.nameObj.multiPinyin,row.num_index);
	        return "<span>"+html+"</span>";
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules.split(',');
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
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
            $scope.editPanelIsOpen = true;
            initEditTable();
        };
        /***
         * 解析拼音数据
         */
        var parseNamesMultiPinyin = function(data){
            //含有名称多音字的poiArr
            var datalist = [];
            for(var i in data.names){
                var composeStr = data.names[i].nameClass+"" + data.names[i].nameType+"" + data.names[i].langCode;
                switch (composeStr){
                    case '11CHI':// 官方标准化中文名
                    case '11CHT':// 港澳官方标准化中文名
                    	if(data.names[i].multiPinyin && data.names[i].multiPinyin.length > 0){
                    		var newpoi = angular.copy(data);
                    		newpoi.names = [];
                    		data.names[i].nameClass = "A";
                    		data.names[i].nameType = "A";
                    		data.names[i].langCode = "A";
                    		newpoi.names.push(data.names[i]);
                    		datalist.push(newpoi);
                    	}
                    	break;
                    case "51CHI":// 中文简称
                    case "51CHT":// 港澳中文简称
        	            if(data.names[i].multiPinyin && data.names[i].multiPinyin.length > 0){
        	            	var newpoi = angular.copy(data);
                    		newpoi.names = [];
                    		data.names[i].nameClass = "A";
                    		data.names[i].nameType = "A";
                    		data.names[i].langCode = "A";
                    		newpoi.names.push(data.names[i]);
                    		datalist.push(newpoi);
        	            }
        	            break;
                }
            }
            return datalist;

        };
        $scope.parseNamePinyin = function(dataArr){
        	var data = [];
        	for(var i = 0,length = dataArr.length; i<length; i++){
            	var temp = parseNamesMultiPinyin(dataArr[i]);
                if($.isArray(temp)){
                    data = data.concat(temp);
                } else{
                    data.push(temp);
                }
            }
        	return data;
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
                    		"type":'integrate',
                            "firstWorkItem":"poi_name",
                            "secondWorkItem":"namePinyin",
                            "status":1
                    };
                    dsColumn.queryColumnDataList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        var datalist = $scope.parseNamePinyin(data);
                        var temp = new FM.dataApi.ColPoiList(datalist);
                        $scope.tableDataList = new FM.dataApi.ColPoiList(datalist).dataList;
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
            //获取改变的数据
            var chage = objCtrl.compareColumData($scope.currentEditOrig,$scope.currentEdited);
            console.info(chage);
            //调用接口
            if($scope.editAllDataList.length <= $scope.editorLines){
            	swal("已经是最后一页了!", "", "info");
            }
            $scope.getPerPageEditData($scope.editAllDataList);
            initEditTable();

        };
        //获取当前页要编辑的条数
        $scope.getPerPageEditData = function(allData){
        	//需要编辑的所有数据
        	$scope.editAllDataList = allData;
        	if($scope.editAllDataList.length > $scope.editorLines){
        		//当前页要编辑的数据
            	var resultArr = $scope.editAllDataList.splice(0,$scope.editorLines);
            	$scope.currentEditOrig = angular.copy(resultArr);
    	        $scope.currentEdited = angular.copy(resultArr);
        	}else{
        		$scope.currentEditOrig = angular.copy($scope.editAllDataList);
    	        $scope.currentEdited = angular.copy($scope.editAllDataList);
        	}
        };
        //设置每次作业条数的radio选择逻辑;
        $scope.selectNum = function(params,arg2){
            $scope.inputIsShow = arg2==3?true:false;
            $scope.costomWorkNumEum[3].num = '';
            $scope.editorLines = params.num;
        };
        /*设置每次作业的条数*/
        $scope.setInputValue = function(params){
            $scope.costomWorkNumEum[3].num = parseInt(params);
            if(params<=0){
                alert('必须大于零的整数!');
                return;
            }else{
                $scope.editorLines = parseInt(params);
            }
            $scope.popoverIsOpen = false;
        };
        /**************** 工具条end   ***************/

        /*******************  编辑页面begin  ****************/
        $scope.editor = {};
        $scope.editor.editorCols = [
            { field: "num_index", title: "序号",show: true,width:'20px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'50px'},
            { field: "kindCode", title: "分类",show: true,width:'50px'},
            { field: "nameObj", title: "名称",getValue:getName,show: true,width:'50px'},
            { field: "nameObj", title: "拼音",getValue:getPinyin,show: true,width:'80px'},
            { field: "refMsg", title: "参考信息",getValue:getReferenceInfo,html:true,show: true,width:'50px'},
            { field: "details", title: "详情",getValue: getDetails,html:true,show: true,width:'30px'}
        ];

        function getDetails($scope,row){
            return '<span class="badge pointer" ng-click="showView(row)">查看</span>';
        }
        var pCreatradio = [];
        function getReferenceInfo($scope,row){
        	var rowIndex = row.num_index;
        	var yinArr = row.nameObj.multiPinyin;
	        var pinyin = row.nameObj.nameStrPinyin;
	        var charArr;
	        var pinyinArr;
	        var html = "";
	        for (var j=0;j<yinArr.length;j++) {
	            	var yin = yinArr[j].toString();
	            	var str = yin.substr(yin.indexOf(",") + 3);
	            	pinyinArr = str.split(',');
	            	var multiPYindex = yinArr[j][0];
	            	for(var i=0;i<pinyinArr.length;i++){
         				if(pinyinArr[i] == $scope.radioDefaultVal[j]){
         					html += pinyinArr[i]+'<input type="radio" checked= true ng-click = "changePinyin($event,row)"  name="' +row.nameObj.pid+"_"+j+ '"  value="' + pinyinArr[i] +"_"+j+ '" >';
         				} else {
         					html += pinyinArr[i]+'<input type="radio" ng-click = "changePinyin($event,row)"  name="' +row.nameObj.pid+"_"+j+ '"  value="' + pinyinArr[i] +"_"+j+ '" >';
         				}
	            	}
	            	html += "<br>";
	         }
	         return '<span>'+html+'</span>';
         }

        $scope.changePinyin = function (e,row){
            var value = e.target.value;
            var valueStr = value.split("_");
            var pinyin = valueStr[0];
            var index = valueStr[1];
            var namePinyin = row.nameObj.nameStrPinyin;
            var name = row.nameObj.name;
            var nameMultiPinyin = row.nameObj.multiPinyin;
            var indexArr = $scope.calculateIndex(namePinyin,name,nameMultiPinyin);
            var temp = namePinyin.split(" ");
            temp[indexArr[index]] = pinyin;
            temp = temp.join(" ");
            row.nameObj.nameStrPinyin = temp;
        };

        $scope.closeEditPanel = function (){
            $scope.editPanelIsOpen = false;
            $scope.showImgInfoo = false;
            _self.tableParams.reload();
        };
        
        function initEditTable() {
            _self.editorTable = new NgTableParams({
            }, {
                counts:[],
                dataset: $scope.currentEdited
            });
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
        };
        $scope.closeView = function (){
            $scope.showImgInfoo = false;
        };
        /*******************  编辑页面end  ******************/
        /*初始化方法*/
        function initPage(){
        	initTable();
        }
        initPage();
    }
]);