/**
 * Created by mali on 2016/8/11.
 */
angular.module('app').controller("RoadNameEditPanelCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
    	var objectCtrl = fastmap.uikit.ObjectEditController();
    	var eventCtrl = fastmap.uikit.EventController();
    	$scope.srcFlagEditable = false;
		$scope.langCodeOpt = [
            {"id": "CHI", "label": "简体中文"},
            {"id": "CHT", "label": "繁体中文"},
            {"id": "ENG", "label": "英文"},
            {"id": "POR", "label": "葡萄牙文"}
        ];
		$scope.srcFlagOpt = [
			{"id": 0, "label": "未定义"},
			{"id": 1, "label": "按规则翻译(程序赋值)"},
			{"id": 2, "label": "来自出典(手工录入)"},
			{"id": 3, "label": "现场标牌"}              
		];
		var prefixOpt_CHI = [
			{"id": "东", "label": "东"},
			{"id": "西", "label": "西"},
			{"id": "南", "label": "南"},
			{"id": "北", "label": "北"},
			{"id": "中", "label": "中"},
			{"id": "前", "label": "前"},
			{"id": "后", "label": "后"},
			{"id": "左", "label": "左"},
			{"id": "右", "label": "右"}
		];
		var prefixOpt_ENG = [
			{"id": "East", "label": "E"},
			{"id": "West", "label": "W"},
			{"id": "South", "label":"S"},
			{"id": "North", "label":"N"},
			{"id": "Front", "label":"F"}
		];
		var infixOpt_CHI = [
			{"id": "南", "label": "南"},
			{"id": "西", "label": "西"},
			{"id": "北", "label": "北"},
			{"id": "前", "label": "前"},
			{"id": "后", "label": "后"},
			{"id": "左", "label": "左"},
			{"id": "右", "label": "右"},
			{"id": "中", "label": "中"},
			{"id": "东", "label": "东"},
			{"id": "省", "label": "省"},
			{"id": "市", "label": "市"},
			{"id": "县", "label": "县"},
			{"id": "辅", "label": "辅"},
			{"id": "外", "label": "外"},
			{"id": "上", "label": "上"},
			{"id": "正", "label": "正"},
			{"id": "下", "label": "下"},
			{"id": "内", "label": "内"}
		];
		var infixOpt_ENG = [
			{"id": "East", "label": "E"},
			{"id": "West", "label": "W"},
			{"id": "South", "label":"S"},
			{"id": "North", "label":"N"},
			{"id": "Front", "label":"F"},
   			{"id": "南", "label": "南"},
   			{"id": "西", "label": "西"},
   			{"id": "北", "label": "北"},
   			{"id": "前", "label": "前"},
   			{"id": "后", "label": "后"},
   			{"id": "左", "label": "左"},
   			{"id": "右", "label": "右"},
   			{"id": "中", "label": "中"},
   			{"id": "东", "label": "东"},
   			{"id": "省", "label": "省"},
   			{"id": "市", "label": "市"},
   			{"id": "县", "label": "县"},
   			{"id": "辅", "label": "辅"},
   			{"id": "外", "label": "外"},
   			{"id": "上", "label": "上"},
   			{"id": "正", "label": "正"},
   			{"id": "下", "label": "下"},
   			{"id": "内", "label": "内"}
		       		];
		var suffixOpt_CHI = [
			{"id": "东", "label": "东"},
			{"id": "西", "label": "西"},
			{"id": "南", "label": "南"},
			{"id": "北", "label": "北"},
			{"id": "中", "label": "中"}
		];
		var suffixOpt_ENG = [
			{"id": "East", "label": "E"},
			{"id": "West", "label": "W"},
			{"id": "South", "label":"S"},
			{"id": "North", "label":"N"},
			{"id": "Front", "label":"F"}
 		];
		$scope.roadTypeOpt = [
			{"id": 0, "label": "未区分"},
			{"id": 1, "label": "高速"},
			{"id": 2, "label": "国道"},
			{"id": 3, "label": "铁路"},
			{"id": 4, "label": "出口编号"}
		];
		$scope.codeTypeOpt = [
			{"id": 0, "label": "非国家编号"},
			{"id": 1, "label": "国家高速编号"},
			{"id": 2, "label": "国道编号"},
			{"id": 3, "label": "省道编号"},
			{"id": 4, "label": "县道编号"},
			{"id": 5, "label": "乡道编号"},
			{"id": 6, "label": "专用道编号"},
			{"id": 7, "label": "省级高速编号"}
		];
		$scope.splitFlagOpt = [
			{"id": 0, "label": "无（默认值）"},
			{"id": 1, "label": "人工拆分"},
			{"id": 2, "label": "程序拆分"}
		];
		$scope.hwInfoFlagOpt = [
			{"id": 0, "label": "是"},
			{"id": 1, "label": "否"}
		];
		$scope.hwInfoFlag = 1;
		$scope.initializeData = function(){
    		$scope.roadNameData = objectCtrl.data;
    		objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
    		if($scope.roadNameData.langCode == "ENG"){
    			$scope.prefixOpt = prefixOpt_ENG;
    			$scope.infixOpt = infixOpt_ENG;
    			$scope.suffixOpt = suffixOpt_ENG;
    		}else if($scope.roadNameData.langCode == "CHI"){
    			$scope.prefixOpt = prefixOpt_CHI;
    			$scope.infixOpt = infixOpt_CHI;
    			$scope.suffixOpt = suffixOpt_CHI;
    		}
    		$scope.initFieldEditable();
    	};
    	//初始化各个字段是否可编辑
    	$scope.initFieldEditable = function(){
    		$scope.hwInfoFlagEditable = true;//highway信息标识
    		$scope.typeEditable = true;//类型名称
    		$scope.typePhoneticEditable = true;//类型名发音
    		$scope.baseEditable = true;//基本名称
    		$scope.basePhoneticEditable = true;//基本名发音
    		$scope.prefixEditable = false;//前缀名称
    		$scope.infixEditable = false;//中缀名称
    		$scope.suffixEditable = false;//后缀名称
    		$scope.voiceFileEditable = true;//名称语音
    		$scope.srcFlagEditable = false;//名称来源
    		
    		if($scope.roadNameData.langCode == "ENG"){
    			$scope.codeTypeEditalbe = true;//国家编号
    			$scope.adminIdEditable = false;//行政区划
    			$scope.roadTypeEditable = true;//
    		}else if($scope.roadNameData.langCode == "CHI"){
    			$scope.codeTypeEditalbe = false;//国家编号
    			$scope.adminIdEditable = true;//行政区划
    		}
    	};
    	$scope.initializeData();
        /***
         * 弹出编辑面板
         */
        $scope.searchModal = false;
        $scope.openSearchModal = function(type){
       	 	$scope.searchModal = true;
       	 	if("nameGroup" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/nameGroupTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/nameGroupTableTpl.htm';
	            });
       	 	}else if("type" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/typeTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/typeTableTpl.htm';
	            });
       	 	}else if("admin" == type) {
	       	 	$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/adminTableCtl.js').then(function () {
	            	$scope.searchModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/adminTableTpl.htm';
	            });
       	 	}else{
       	 		return;
       	 	}
       	 	
       	 	console.log("查询");
        };
        /***
         * 关闭编辑面板
         */
        $scope.closeSearchModal = function() {
        	console.log("关闭")
            $scope.searchModal = false;
        };
        /***
         * 道路组名，类型名，行政区划名修改
         */
        $scope.selectVal = function(row, index, type) {
       	 if(type == "admin"){
       		 $scope.roadNameData.adminId = row.whole;
       	 }else if(type == "namegroup"){
       		 $scope.roadNameData.nameGroupid = row.nameGroupid;
       	 }else if(type == "type"){
       		 if("ENG" == $scope.roadNameData.langCode){
       			$scope.roadNameData.type= row.englishname;
       		 }else{
       			var param = {
                		word : row.name	
            	};
            	dsMeta.convert(param).then(function(data) {
            		$scope.roadNameData.typePhonetic = data.phonetic;
                });
       			$scope.roadNameData.type= row.name;
       		 }
       	 }
       	 $scope.searchModal = false;
        };
        /**
         * 前缀名称变化
         */
        $scope.prefixChange = function(event, obj) {
        	var param = {
        		word : obj.roadNameData.prefix	
        	};
        	dsMeta.convert(param).then(function(data) {
        		$scope.roadNameData.prefixPhonetic = data.phonetic;
            });
        };
        /***
         * 转拼音
         */
        $scope.getPy = function(event, obj, field, pyfield) {
        	if($scope.roadNameData.langCode == "ENG"){
        		return;
        	}
        	var param = {
            		word : obj.roadNameData[field]	
        	};
        	dsMeta.convert(param).then(function(data) {
        		$scope.roadNameData[pyfield] = data.phonetic;
            });
        };
        /***
         * 保存
         */
        $scope.doSave = function() {
        	//roadName为原始类型，查询返回里没有type,不能调用objectCtrl.setCurrentObject
        	objectCtrl.data = $scope.roadNameData;
            objectCtrl.save();
            var changed =  objectCtrl.changedProperty;
            if(changed){
//            	'key' in obj; obj.hasOwnProperty('key')
//            	name，road_type，admin_id，name_groupid，name_id
            	changed.name = $scope.roadNameData.name;
            	changed.roadType = $scope.roadNameData.roadType;
            	changed.adminId = $scope.roadNameData.adminId;
            	changed.nameId = $scope.roadNameData.nameId;
            	changed.nameGroupId = $scope.roadNameData.nameGroupid;
            	var param = {
            			data : changed
            	};
            	dsMeta.roadNameSave(param).then(function(data) {
            		$scope.$emit("REFRESHROADNAMELIST");
                });
            	
            }else{
            	swal("属性值没有变化", "", "info");
				return;
            }
        };
        /***
         * 道路类型切换
         */
        $scope.roadTypeChange = function(event, obj){
        	var test = {a:1,b:3,c:3};
        	if(obj.roadNameData.roadType == 1){//高速
        		$scope.hwInfoFlagEditable = false;
        		$scope.roadNameData.voiceFile = $scope.roadNameData.memo;
        	}else if(obj.roadNameData.roadType == 3){//铁路
        		$scope.typeEditable = false;//类型名称
        		$scope.typePhoneticEditable = false;//类型名发音
        		$scope.baseEditable = false;//基本名称
        		$scope.basePhoneticEditable = false;//基本名发音
        		$scope.prefixEditable = true;//前缀名称
        		$scope.infixEditable = true;//中缀名称
        		$scope.suffixEditable = true;//后缀名称
        		$scope.voiceFileEditable = false;//名称语音
        		$scope.srcFlagEditable = true;//名称来源
        		$scope.codeTypeEditalbe = true;//国家编号
    			$scope.adminIdEditable = false;//行政区划
    			$scope.hwInfoFlagEditable = true;
        	}else if(obj.roadNameData.roadType == 3){//出口编号
        		$scope.typeEditable = false;//类型名称
        		$scope.typePhoneticEditable = false;//类型名发音
        		$scope.baseEditable = false;//基本名称
        		$scope.basePhoneticEditable = false;//基本名发音
        		$scope.prefixEditable = true;//前缀名称
        		$scope.infixEditable = true;//中缀名称
        		$scope.suffixEditable = true;//后缀名称
        		$scope.hwInfoFlagEditable = true;
        	}else{
        		$scope.initFieldEditable();
        	}
        };
        /*start 事件监听 *********************************************************/
        eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    }


]);