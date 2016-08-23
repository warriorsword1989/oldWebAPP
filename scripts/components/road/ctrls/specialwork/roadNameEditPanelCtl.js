/**
 * Created by mali on 2016/8/11.
 */
angular.module('app').controller("RoadNameEditPanelCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
    	var objectCtrl = fastmap.uikit.ObjectEditController();
    	var eventCtrl = fastmap.uikit.EventController();
    	$scope.srcFlagDisable = false;
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
			var type = $scope.roadNameFlag;
			if("add" == type){
//				var defautdata = {
//						langCode : "CHI",
//						srcFlag : 0,
//						roadType : 0,
//						codeType : 0,
//						routeId : 0,
//						splitFlag : 0
//						
//				};
				$scope.roadNameData = fastmap.dataApi.roadName({});
			}else if("edit" == type){
				$scope.roadNameData = objectCtrl.data;
	    		objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
			}
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
    		var type = $scope.roadNameFlag;
    		if("edit" == type){
    			$scope.hwInfoFlagDisable = true;//highway信息标识
        		$scope.typeEditable = true;//类型名称
        		$scope.typePhoneticEditable = true;//类型名发音
        		$scope.baseEditable = true;//基本名称
        		$scope.basePhoneticEditable = true;//基本名发音
        		$scope.prefixDisable = false;//前缀名称
        		$scope.infixDisable = false;//中缀名称
        		$scope.suffixDisable = false;//后缀名称
        		$scope.voiceFileEditable = true;//名称语音
        		$scope.srcFlagDisable = false;//名称来源
        		$scope.nameGroupidEditable = false;
        		$scope.langCodeDisable = true;//语言类型
        		if($scope.roadNameData.langCode == "ENG"){
        			$scope.codeTypeDisable = true;//国家编号
        			$scope.adminIdEditable = false;//行政区划
        			$scope.roadTypeDisable = true;//道路类型
        			$scope.nameEditable = false;//道路名称
        		}else if($scope.roadNameData.langCode == "CHI"){
        			$scope.codeTypeDisable = false;//国家编号
        			$scope.adminIdEditable = true;//行政区划
        			$scope.roadTypeDisable = false;//道路类型
        			$scope.nameEditable = true;//道路名称
        		}
    		}else if("add" == type){
    			$scope.hwInfoFlagDisable = true;//highway信息标识
        		$scope.typeEditable = true;//类型名称
        		$scope.typePhoneticEditable = true;//类型名发音
        		$scope.baseEditable = true;//基本名称
        		$scope.basePhoneticEditable = true;//基本名发音
        		$scope.prefixDisable = false;//前缀名称
        		$scope.infixDisable = false;//中缀名称
        		$scope.suffixDisable = false;//后缀名称
        		$scope.voiceFileEditable = true;//名称语音
        		$scope.srcFlagDisable = false;//名称来源
        		$scope.nameGroupidEditable = true;//道路组id
        		$scope.langCodeDisable = false;//语言类型
        		$scope.codeTypeDisable = false;//国家编号
    			$scope.adminIdEditable = true;//行政区划
    			$scope.roadTypeDisable = false;//道路类型
    			$scope.nameEditable = false;//道路名称
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
       	 		if($scope.roadNameFlag == "add") {
       	 			if("CHI" == $scope.roadNameData.langCode || "CHT" == $scope.roadNameData.langCode){
       	 				swal("道路名组在语言类型为中文时系统会自动分配，不能选择", "", "info");
       	 				return;
       	 			}
       	 		}
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
            $scope.searchModal = false;
        };
        /***
         * 道路组名，类型名，行政区划名修改
         */
        $scope.selectVal = function(row, index, type) {
       	 if(type == "admin"){
   			$scope.roadNameData.adminId = parseInt(row.adminareacode);
   			$scope.roadNameData.adminName = row.whole;
       	 }else if(type == "namegroup"){
       		 if("add" == $scope.roadNameFlag){
       			var param = {
   	 					nameGroupid : parseInt(row.nameGroupid)
                	};
            	dsMeta.rdnameGroup(param).then(function(data) {
            		if(data.data){
            			swal("该道路名组内已经存在两条记录，不可再添加。请选择其他道路名组", "", "info");
            		}else{
            			$scope.roadNameData.nameGroupid = row.nameGroupid;
            			$scope.searchModal = false;
            		}
                });
       		 }else if("edit" == $scope.roadNameFlag){
       			$scope.roadNameData.nameGroupid = row.nameGroupid;
       			$scope.searchModal = false;
       		 }
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
       		$scope.searchModal = false;
       	 }
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
        	
            if("add" == $scope.roadNameFlag){
            	if($scope.roadNameData.name == undefined || $scope.roadNameData.name == null || $scope.roadNameData.name == ""){
            		swal("道路名不能为空", "", "info");
            		return;
            	}else if($scope.roadNameData.adminId == undefined || $scope.roadNameData.adminId == null || $scope.roadNameData.adminId == ""){
            		swal("行政区划不能为空", "", "info");
            		return;
            	}
            	if($scope.roadNameData.langCode == "ENG" || $scope.roadNameData.langCode == "POR"){
            		if($scope.roadNameData.nameGroupid == undefined || $scope.roadNameData.nameGroupid == null || $scope.roadNameData.nameGroupid == ""){
                		swal("非中文的语言类型，必须选择一个名称组", "", "info");
                		return;
                	}
            	}else{
            		var param = {
                			data : $scope.roadNameData
                	};
                	dsMeta.roadNameSave(param).then(function(data) {
                		$scope.$emit("REFRESHROADNAMELIST");
                    });
            	}
            }else if("edit" == $scope.roadNameFlag){
            	objectCtrl.data = $scope.roadNameData;
                objectCtrl.save();
                var changed =  objectCtrl.changedProperty;
                if(changed){
//                	'key' in obj; obj.hasOwnProperty('key')
                	changed.name = $scope.roadNameData.name;
                	changed.roadType = $scope.roadNameData.roadType;
                	changed.adminId = $scope.roadNameData.adminId;
                	changed.nameId = $scope.roadNameData.nameId;
                	changed.nameGroupid = $scope.roadNameData.nameGroupid;
                	var param = {
                			data : $scope.roadNameData
                	};
                	dsMeta.roadNameSave(param).then(function(data) {
                		swal({
    						title: "保存成功",
    						type: "info",
    						showCancelButton: false,
    						closeOnConfirm: true,
    						confirmButtonText: "确定",
    					}, function (f) {
    						if(f){
    							$scope.$emit("REFRESHROADNAMELIST");
//    							$scope.$apply();
    						}
    					});
                    });
                	
                }else{
                	swal("属性值没有变化", "", "info");
    				return;
                }
            }
            $scope.closeEditPanel();
            
        };
        /***
         * 道路类型切换
         */
        $scope.roadTypeChange = function(event, obj){
        	if(obj.roadNameData.roadType == 1){//高速
        		$scope.hwInfoFlagDisable = false;
        		$scope.roadNameData.voiceFile = $scope.roadNameData.memo;
        	}else if(obj.roadNameData.roadType == 3){//铁路
        		$scope.typeEditable = false;//类型名称
        		$scope.typePhoneticEditable = false;//类型名发音
        		$scope.baseEditable = false;//基本名称
        		$scope.basePhoneticEditable = false;//基本名发音
        		$scope.prefixDisable = true;//前缀名称
        		$scope.infixDisable = true;//中缀名称
        		$scope.suffixDisable = true;//后缀名称
        		$scope.voiceFileEditable = false;//名称语音
        		$scope.srcFlagDisable = true;//名称来源
        		$scope.codeTypeDisable = true;//国家编号
    			$scope.adminIdEditable = false;//行政区划
    			$scope.hwInfoFlagDisable = true;
        	}else if(obj.roadNameData.roadType == 3){//出口编号
        		$scope.typeEditable = false;//类型名称
        		$scope.typePhoneticEditable = false;//类型名发音
        		$scope.baseEditable = false;//基本名称
        		$scope.basePhoneticEditable = false;//基本名发音
        		$scope.prefixDisable = true;//前缀名称
        		$scope.infixDisable = true;//中缀名称
        		$scope.suffixDisable = true;//后缀名称
        		$scope.hwInfoFlagDisable = true;
        	}else{
        		$scope.initFieldEditable();
        	}
        };
        /*start 事件监听 *********************************************************/
        eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
    }


]);