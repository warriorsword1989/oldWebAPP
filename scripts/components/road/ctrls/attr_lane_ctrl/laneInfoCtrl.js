/**
 * Created by wangmingdong on 2016/9/5.
 */

angular.module("app").controller("LaneInfoCtl", ['$scope', 'dsEdit' ,'dsMeta','$timeout','$ocLazyLoad', function ($scope, dsEdit,dsMeta,$timeout,$ocLazyLoad) {
	var objCtrl = fastmap.uikit.ObjectEditController();
	$scope.laneCondition = objCtrl.laneInfo;

	$scope.carData=[];
	$scope.carSelect=function(item){
		if(item.checked){
			item.checked=false;
			for(var i in $scope.carData){
				if($scope.carData[i].id.toString()==item.id){
					$scope.carData.splice(i,1);
				}
			}
		}else{
			item.checked=true;
			$scope.carData.push(item);
		}
		$scope.checkViche();
	};
	$scope.showvehicle=function(vehicle){
		var towbin=dec2bin(vehicle);

		//循环车辆值域，根据数据库数据取出新的数组显示在页面
		var originArray=[];
		$scope.checkValue=false;
		var len=towbin.length-1;
		//长度小于32即是没有选中checkbox，不允许
		if(towbin.length<32){
			$scope.checkValue=false;
		}else{
			len=towbin.length-2;
			$scope.checkValue=true;
		}
		for(var i=len;i>=0;i--){
			if(towbin.split("").reverse().join("")[i]==1){
				originArray.push($scope.vehicleOptions[i]);
			}
		}

		if(originArray.length === 0){
			$scope.carData = [];
		} else {
			for(var p in originArray){
				for(var s in $scope.vehicleOptions){
					if(originArray[p].id.toString()==$scope.vehicleOptions[s].id){
						$scope.vehicleOptions[s].checked=true;
						$scope.carData.push($scope.vehicleOptions[s]);
					}
				}
			}
		}
	};
	$scope.showPopover=function(e){
		var dateTimeWell = $(e.target).parents('.fm-container').parent();
		$('body').append($(e.target).parents(".fm-container").find(".carTip"));
		if($('body .carTip:last').css('display') == 'none'){
			$(".carTip").css({'top':($(e.target).offset().top-100)+'px','right':(dateTimeWell.attr('data-type')==1)?'300px':'600px'});
			$('body .carTip:last').show();
		}else{
			$('body .carTip:last').hide();
		}
	};
	$scope.checkViche=function(){
		var newArray=[];
		var result="";
		for(var j=0;j<$scope.carData.length;j++){
			newArray.push($scope.carData[j].id);
		}
		for(var i=31;i>=0;i--){
			if(i==31){
				if($scope.checkValue){
					result+="1";//允许
				}else{
					result+="0";//禁止
				}
			}else{
				if($.inArray(i, newArray)!=-1){
					result+="1";
				}else{
					result+="0";
				}
			}

		}

		$scope.laneCondition.vehicle=parseInt(bin2dec(result));
	};

	$timeout(function(){
			$ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
					$scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
					$timeout(function(){
							$scope.fmdateTimer($scope.laneCondition.directionTime);
							$scope.$broadcast('set-code',$scope.laneCondition.directionTime);
							$scope.$apply();
					},100);
					$ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimerDouble').then(function () {
							$scope.dateDoubleURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimerDouble.html';
							$timeout(function(){
									$scope.carFmdateTimer($scope.laneCondition.vehicleTime);
									$scope.$broadcast('set-code',$scope.laneCondition.vehicleTime);
									$scope.$apply();
							},100);
					});
			});
	});
	/*时间控件*/
	$scope.fmdateTimer = function(str){
			$scope.$on('get-date', function(event,data) {
					$scope.laneCondition.directionTime = data;
			});
			$timeout(function(){
					$scope.$broadcast('set-code',str);
					$scope.laneCondition.directionTime = str;
					$scope.$apply();
			},100);
	};
	$scope.carFmdateTimer = function(str){
			$scope.$on('get-date', function(event,data) {
					$scope.laneCondition.vehicleTime = data;
			});
			$timeout(function(){
					$scope.$broadcast('set-code',str);
					$scope.laneCondition.vehicleTime = str;
					$scope.$apply();
			},100);
	};
		$scope.vehicleOptions = [
			{"id": 0, "label": "客车(小汽车)","checked":false},
			{"id": 1, "label": "配送卡车","checked":false},
			{"id": 2, "label": "运输卡车","checked":false},
			{"id": 3, "label": "步行车","checked":false},
			{"id": 4, "label": "自行车","checked":false},
			{"id": 5, "label": "摩托车","checked":false},
			{"id": 6, "label": "机动脚踏两用车","checked":false},
			{"id": 7, "label": "急救车","checked":false},
			{"id": 8, "label": "出租车","checked":false},
			{"id": 9, "label": "公交车","checked":false},
			{"id": 10, "label": "工程车","checked":false},
			{"id": 11, "label": "本地车辆","checked":false},
			{"id": 12, "label": "自用车辆","checked":false},
			{"id": 13, "label": "多人乘坐车辆","checked":false},
			{"id": 14, "label": "军车","checked":false},
			{"id": 15, "label": "有拖车的车","checked":false},
			{"id": 16, "label": "私营公共汽车","checked":false},
			{"id": 17, "label": "农用车","checked":false},
			{"id": 18, "label": "载有易爆品的车辆","checked":false},
			{"id": 19, "label": "载有水污染品的车辆","checked":false},
			{"id": 20, "label": "载有其他污染品的车辆","checked":false},
			{"id": 21, "label": "电车","checked":false},
			{"id": 22, "label": "轻轨","checked":false},
			{"id": 23, "label": "校车","checked":false},
			{"id": 24, "label": "四轮驱动车","checked":false},
			{"id": 25, "label": "装有防雪链的车","checked":false},
			{"id": 26, "label": "邮政车","checked":false},
			{"id": 27, "label": "槽罐车","checked":false},
			{"id": 28, "label": "残疾人车","checked":false}
		];
	$scope.langCodeOptions = [
		{"id": "CHI", "label": "简体中文"},
		{"id": "CHT", "label": "繁体中文"},
		{"id": "ENG", "label": "英文"},
		{"id": "POR", "label": "葡萄牙文"},
		{"id": "ARA", "label": "阿拉伯语"},
		{"id": "BUL", "label": "保加利亚语"},
		{"id": "CZE", "label": "捷克语"},
		{"id": "DAN", "label": "丹麦语"},
		{"id": "DUT", "label": "荷兰语"},
		{"id": "FIN", "label": "芬兰语"},
		{"id": "FRE", "label": "法语"},
		{"id": "GER", "label": "德语"},
		{"id": "HIN", "label": "印地语"},
		{"id": "HUN", "label": "匈牙利语"},
		{"id": "ICE", "label": "冰岛语"},
		{"id": "IND", "label": "印度尼西亚语"},
		{"id": "ITA", "label": "意大利语"},
		{"id": "JPN", "label": "日语"},
		{"id": "KOR", "label": "韩语"},
		{"id": "LIT", "label": "立陶宛语"},
		{"id": "NOR", "label": "挪威语"},
		{"id": "POL", "label": "波兰语"},
		{"id": "RUM", "label": "罗马尼西亚语"},
		{"id": "RUS", "label": "俄语"},
		{"id": "SLO", "label": "斯洛伐克语"},
		{"id": "SPA", "label": "西班牙语"},
		{"id": "SWE", "label": "瑞典语"},
		{"id": "THA", "label": "泰国语"},
		{"id": "TUR", "label": "土耳其语"},
		{"id": "UKR", "label": "乌克兰语"},
		{"id": "SCR", "label": "克罗地亚语"}
	];
	$scope.$on('refreshLaneCondition',function(data){
		$scope.laneCondition = objCtrl.laneInfo;
		$scope.showvehicle($scope.laneCondition.vehicle);
	});
}]);
