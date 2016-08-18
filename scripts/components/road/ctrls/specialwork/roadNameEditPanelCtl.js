/**
 * Created by mali on 2016/8/11.
 */
angular.module('app').controller("RoadNameEditPanelCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
    	var objectCtrl = fastmap.uikit.ObjectEditController();
		$scope.roadNameData = fastmap.dataApi.roadName($scope.roadName);
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
		$scope.prefixOpt = [
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
//		var prefixOption = {
//				0: "东",
//				1: "西",
//				2: "南",
//				3: "北",
//				4: "中",
//				5: "前",
//				6: "后",
//				7: "左",
//				8: "右"
//		};
		$scope.infixOpt = [
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
		$scope.suffixOpt = [
			{"id": "东", "label": "东"},
			{"id": "西", "label": "西"},
			{"id": "南", "label": "南"},
			{"id": "北", "label": "北"},
			{"id": "中", "label": "中"}
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
       		 $scope.param.nameGroupid = row.nameGroupid;
       	 }else if(type == "type"){
       		 $scope.roadNameData.type= row.name;
       		var param = {
            		word : row.name	
        	};
        	dsMeta.convert(param).then(function(data) {
        		$scope.roadNameData.typePhonetic = data.phonetic;
            });
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

            objectCtrl.save();
            var chaged =  objectCtrl.changedProperty;
            if(!chaged){
                swal({
                    title: "属性值没有变化，是否保存？",
                    type: "warning",
                    animation: 'slide-from-top',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: "是的，我要保存",
                    cancelButtonText: "取消"
                }, function(f) {
                    if(f){
                    	alert()
//                        dsEdit.update($scope.poi.pid, "IXPOI", {
//                            "rowId": objectCtrl.data.rowId,
//                            "pid": objectCtrl.data.pid,
//                            "objStatus": "UPDATE"
//                        }).then(function(data) {
//                            if(data){
//                                if(!$scope.$parent.$parent.selectPoiInMap){ //false表示从poi列表选择，true表示从地图上选择
//                                    if (map.floatMenu) {
//                                        map.removeLayer(map.floatMenu);
//                                        map.floatMenu = null;
//                                    }
//                                    eventCtrl.fire(eventCtrl.eventTypes.CHANGEPOILIST, {"poi":$scope.poi,"flag":'update'});
//                                }
//                            }
//                        });
                    }
                });
                return;
            }
        };
    }
]);