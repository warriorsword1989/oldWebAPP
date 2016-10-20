/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('RoadNameCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta',  
     function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta) {
		var objectCtrl = fastmap.uikit.ObjectEditController();
		var _self = $scope;
         /*初始化显示table提示*/
         $scope.loadTableDataMsg = '数据加载中...';
         $scope.checkboxes = {checked: false};
         var eventCtrl = fastmap.uikit.EventController();
         //监控全选;
         $scope.$watch(function() {
             return $scope.checkboxes.checked;
         }, function(value) {
             angular.forEach($scope.roadNameList, function(item) {
                 item.checked = value;
             });
         });

         $scope.cols = [
             {
                 field: "selector",
                 title: "选择",
                 headerTemplateURL: "headerCheckbox.html",
                 width:'40px',
                 show: true
             },
//             {
//                 field: "num_index",
//                 title: "序号",
//                 width: '50px',
//                 show: true
//             },
             {
                 field: "nameGroupid",
                 title: "组ID",
                 sortable: "nameGroupid",
                 width: '40px',
                 show: true
             },
             {
                 field: "name",
                 title: "道路名称",
                 width: '',
                 sortable: "name",
                 show: true
             },
             {
                 field: "type",
                 title: "类型",
                 width: '40px',
                 sortable: "type",
                 show: true
             },
             {
                 field: "base",
                 title: "基本名称",
                 width: '',
                 sortable: "base",
                 show: true
             },
             {
                 field: "prefix",
                 title: "前缀",
                 width: '40px',
                 sortable: "prefix",
                 show: true
             },
             {
                 field: "infix",
                 title: "中缀",
                 width: '40px',
                 sortable: "infix",
                 show: true
             },
             {
                 field: "suffix",
                 title: "后缀",
                 width: '40px',
                 sortable: "suffix",
                 show: true
             },
             {
                 field: "namePhonetic",
                 title: "道路名发音",
                 width: '',
                 sortable: "namePhonetic",
                 show: true
             },
             {
                 field: "tipsId",
                 title: "TipsID",
                 width: '50px',
                 sortable: "tipsId",
                 show: true
             },
             {
                 field: "basePhonetic",
                 title: "基本名发音",
                 width: '',
                 sortable: "basePhonetic",
                 show: true
             },
             {
                 field: "prefixPhonetic",
                 title: "前缀发音",
                 width: '60px',
                 sortable: "prefixPhonetic",
                 show: true
             },
             {
                 field: "infixPhonetic",
                 title: "中缀发音",
                 width: '60px',
                 sortable: "infixPhonetic",
                 show: true
             },
             {
                 field: "suffixPhonetic",
                 title: "后缀发音",
                 width: '60px',
                 sortable: "suffixPhonetic",
                 show: true
             },
             {
                 field: "nameId",
                 title: "道路名ID",
                 width: '60px',
                 sortable: "nameId",
                 show: false
             },
             {
                 field: "langCode",
                 title: "语音代码",
                 width: '60px',
                 sortable: "langCode",
                 show: false
             },
             {
                 field: "errMsg",
                 title: "错误日志",
                 width: '60px',
                 sortable: "errMsg",
                 show: false
             },
             {
                 field: "srcFlag",
                 title: "名称来源",
                 width: '60px',
                 sortable: "srcFlag",
                 show: false
             },
             {
                 field: "roadType",
                 title: "道路类型",
                 width: '60px',
                 sortable: "roadType",
                 show: false
             },
             {
                 field: "adminName",
                 title: "行政区划",
                 width: '60px',
                 sortable: "adminId",
                 show: false
             },
             {
                 field: "codeType",
                 title: "国家名称",
                 width: '60px',
                 sortable: "codeType",
                 show: false
             },
             {
                 field: "voiceFile",
                 title: "名称语言",
                 width: '60px',
                 sortable: "voiceFile",
                 show: false
             },
             {
                 field: "paRegionId",
                 title: "点门牌区划代码",
                 width: '100px',
                 sortable: "paRegionId",
                 show: false
             },
             {
                 field: "processFlag",
                 title: "作业状态",
                 width: '60px',
                 sortable: "processFlag",
                 show: true
             },
             {
                 field: "splitFlag",
                 title: "拆分标识",
                 width: '60px',
                 sortable: "splitFlag",
                 show: false
             }
//             ,
//             {
//                 field: "city",
//                 title: "地级市名称",
//                 width: '60px',
//                 sortable: "city",
//                 show: true
//             }
         ];

         //初始化显示表格字段方法;
         $scope.initShowField = function(params) {
             for (var i = 0; i < $scope.cols.length; i++) {
                 for (var j = 0; j < params.length; j++) {
                     if ($scope.cols[i].title == params[j]) {
                         $scope.cols[i].show = true;
                     }
                 }
             }
         };
         //重置表格字段显示方法;
         $scope.resetTableField = function() {
             for (var i = 0; i < $scope.cols.length; i++) {
                 if ($scope.cols[i].show) {
                     $scope.cols[i].show = !$scope.cols[i].show;
                 }
             }
         };
         $scope.searchType = 'name';
         //刷新表格方法;
         var refreshData = function() {
             _self.tableParams.reload();
         };
         //表格配置搜索;
         $scope.filter = {
     			name : "",
     			nameGroupid: "",
     			adminId: "",
     			flag:-1
     	 };
         //接收高级查询过滤条件
         $scope.$on("FITERPARAMSCHANGE",function(event,data){
        	 $scope.filter.name = data["name"];
        	 $scope.filter.nameGroupid = data["nameGroupid"];
        	 $scope.filter.adminId = data["adminId"];
//        	 $scope.filter.sql = data["sql"];
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
                         flag: params.filter().flag,	 
                         params:{"name":params.filter().name,"nameGroupid":params.filter().nameGroupid,"adminId":params.filter().adminId}
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
             $scope.itemActive = -1;
             angular.forEach($scope.tableParams.data, function(data, index) {
                 data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                 data.checked = false;
             });
         });

         /*初始化方法*/
         initRoadNameTable();

         /***
          * 弹出编辑面板
          */
         $scope.editPanel = false;
         $scope.openEditPanel = function(data, index){
        	 $scope.roadNameFlag = "edit";
        	 $scope.editPanel = true;
        	 $scope.roadName = data;
        	 objectCtrl.setCurrentObject("ROADNAME",data);
//        	 console.log('当条数据'+JSON.stringify(data))
//        	 $scope.roadNameData = fastmap.dataApi.roadName(data);
             $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
        	 $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameEditPanelCtl.js').then(function () {
             	$scope.roadNameEditPanelTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameEditPanelTpl.htm';
             });
        	 console.log("双击");
         };
         /***
          * 关闭编辑面板
          */
         $scope.closeEditPanel = function() {
             $scope.editPanel = false;
         };
         /***
          * 对应弹出查询、新增、拆分、检查面板
          */
         $scope.subModal = false;
         $scope.openSubModal = function(type) {
        	 $scope.subModal = true;
        	 if("search" == type) {
        		 //
        		 $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/searchSubModalCtl.js').then(function () {
                  	$scope.subModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/searchSubModalTpl.htm';
                  });
        	 }else if("add" == type) {
        		 $scope.roadNameFlag = "add";
        		 $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameEditPanelCtl.js').then(function () {
                   	$scope.subModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameEditPanelTpl.htm';
                   });
        		 eventCtrl.fire(eventCtrl.eventTypes.SELECTEDFEATURECHANGE);
        	 }else if("split" == type) {
        		 $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/splitSubModalCtl.js').then(function () {
                   	$scope.subModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/splitSubModalTpl.htm';
                   });
        	 }else if("check" == type) {
        		 alert("暂无");
        		 $scope.subModalTpl = "";
        		 $scope.subModal = false;
        		 return;
        	 }else {
        		 return;
        	 }
         };
         /**
          * 拆分窗口显示和关闭
          */
         $scope.splitSubModal = false;
         $scope.openSplitSubModal = function(){
        	 $scope.splitSubModal = true;
        	 $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/splitSubModalCtl.js').then(function () {
                	$scope.splitSubModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/splitSubModalTpl.htm';
                });
         };
         $scope.closeSplitSubModal = function(){
        	 $scope.splitSubModal = false;
         };
         /***
          * 关闭子面板
          */
         $scope.closeSubModal = function() {
             $scope.subModal = false;
         };
         $scope.$on("CLOSECURRENTPANEL",function(event,data){
        	 $scope.subModal = false;
         });
         /***
          * 编辑界面保存后，列表界面刷新，并关闭编辑界面
          */
         $scope.$on("REFRESHROADNAMELIST",function(event,data){
        	 refreshData();
         });
         $scope.getSelectedData = function(){
        	 var selectedRoadNameList = [];
        	 for(var i=0;i<$scope.roadNameList.length;i++){
        		 if($scope.roadNameList[i].checked){
        			 selectedRoadNameList.push({
        				 nameId : $scope.roadNameList[i].nameId,
        				 nameGroupid : $scope.roadNameList[i].nameGroupid,
        				 langCode : $scope.roadNameList[i].langCode,
        				 roadType : $scope.roadNameList[i].roadType
        			 });
        		 }
        	 }
        	 return selectedRoadNameList;
         };
         
     }
 ]);