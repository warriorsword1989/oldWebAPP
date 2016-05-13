angular.module('app', ['oc.lazyLoad', 'ui.bootstrap', 'ngTable', 'dataService','ngSanitize']).controller('DataListCtl', ['$scope', '$ocLazyLoad', '$rootScope', '$q', 'poi',function($scope, $ocll, $rs, $q, poi ) {
	var promises = [];
	var _code_project_type = {
		1: "常规",
		2: "精编",
		3: "监察",
		4: "情报",
		6: "多源"
	};
	promises.push(poi.getOperSeason("2016013086",function(data){
		$scope.curSeason = data;
	}));
	promises.push(poi.getProjectInfo("2016013086",function(data){
		$scope.projectInfo = data;
		$scope.projectType = _code_project_type[data.projectType];
		var today = new Date().getTime();
		var finish = new Date($scope.projectInfo.projectScheduleFinish.replace(/\-/g, "\/")).getTime();
		var test = finish - today;
		var day = 0;
		var hour = 0;
		var min = 0;
		if (test > 0) {
			test = Math.ceil(test / 1000);
			day = Math.floor(test / (3600 * 24));
			hour = Math.floor((test - day * 24 * 3600) / 3600);
			min = Math.floor((test - day * 24 * 3600 - hour * 3600) / 60);
		}
		$scope.projRemainTime = day + "天" + hour + "小时" + min + "分钟";
	}));
	var countParam = {
		projectId: "2016013086",
		condition: {
			handler: "2925"
		},
		phase: "4",
		featcode: "poi",
		type: "count",
		pagesize: 0
	};
	promises.push(poi.getPoiInfo(countParam,function(data){
		$scope.taskCnt = data.total;
	}));
	var rawDataParam = {
		projectId: "2016013086",
		condition: {
			handler: "2925",
			auditStatus: 1
		},
		sortby: [
			["latestMergeDate", -1]
		],
		phase: "4",
		featcode: "poi",
		type: "snapshot",
		pagesize: 0
	};
	promises.push(poi.getPoiInfo(rawDataParam,function(data){
		$scope.rawData = data.data;
	}));
	var dealedDataParam = {
		projectId: "2016013086",
		condition: {
			handler: "2925",
			auditStatus: {
				'$in': [2, 5]
			}
		},
		sortby: [
			["latestMergeDate", -1]
		],
		phase: "4",
		featcode: "poi",
		type: "snapshot",
		pagesize: 0
	};
	promises.push(poi.getPoiInfo(dealedDataParam,function(data){
		$scope.dealedData = data.data;
	}));
	var submitedDataParam = {
		projectId: "2016013086",
		condition: {
			handler: "2925",
			auditStatus: 0,
			submitStatus: 1
		},
		sortby: [
			["latestMergeDate", -1]
		],
		phase: "4",
		featcode: "poi",
		type: "snapshot",
		pagesize: 0
	};
	promises.push(poi.getPoiInfo(submitedDataParam,function(data){
		$scope.submitedData = data.data;
	}));
	var checkRuleObj = {};
	FM.dataApi.CheckRule.getList(function(data){
        for(var i=0,len=data.length;i<data.length;i++){
        	checkRuleObj[data[i].ruleId] = data[i];
        }
    });
	$scope.checkRuleObj = checkRuleObj;
	FM.dataApi.IxPoiTopKind.getList(function(data){
		$scope.pKindFormat = new Object();
        for (var i = 0; i < data.length; i++) {
//            if (data[i].kindCode == "230218" || data[i].kindCode == "230227") {
//                data.splice(i, 1);
//                i--;
//                continue;
//            }
        	$scope.pKindFormat[data[i].kindCode] = {
                kindId: data[i].id,
                kindName: data[i].kindName,
                level: data[i].level,
                extend: data[i].extend,
                parentFlag: data[i].parent,
                chainFlag: data[i].chainFlag,
                dispOnLink: data[i].dispOnLink,
                mediumId: data[i].mediumId
            };
        }
	});
	$scope.$on('getPageData',function(event, data){
		poi.getPoiInfo(data,function(data){
			$scope.$broadcast('getPageDataResult',data);
		});
    });
	$q.all(promises).then(function() {
		$scope.$broadcast("initPageInfo", {"projectInfo" : $scope.projectInfo,"projectType" : $scope.projectType,"projRemainTime":$scope.projRemainTime,"curSeason":$scope.curSeason,
			"taskCnt":$scope.taskCnt,"rawData":$scope.rawData,"dealedData":$scope.dealedData,"submitedData":$scope.submitedData,"checkRule":$scope.checkRuleObj});
		$ocll.load("components/poi/ctrls/data-list/headCtl").then(function() {
			$scope.headTpl = "../../scripts/components/poi/tpls/data-list/header.html";
		});
		$ocll.load("components/poi/ctrls/data-list/projectInfoCtrl").then(function() {
			$scope.projectInfoTpl = "../../scripts/components/poi/tpls/data-list/projectInfo.html";
//	        $scope.$on('$includeContentLoaded', function($event) {
//	        	$scope.$broadcast("initProjectInfo", {"projectInfo" : $scope.projectInfo,"projectType" : $scope.projectType,"projRemainTime":$scope.projRemainTime,"curSeason":$scope.curSeason});
//            });
		});
		$ocll.load("components/poi/ctrls/data-list/generalDataListCtrl").then(function() {
			$scope.generalDataListTpl = "../../scripts/components/poi/tpls/data-list/generalDataList.htm";
		});
//		$scope.$broadcast("initProjectInfo", {"projectInfo" : $scope.projectInfo,"projectType" : $scope.projectType,"projRemainTime":$scope.projRemainTime,"curSeason":$scope.curSeason});
	});

}]);