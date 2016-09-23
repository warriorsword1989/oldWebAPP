/**
 * Created by linglong on 2016/8/15.
 */
var rdElectronicEyeApp = angular.module("app");
rdElectronicEyeApp.controller("variableSpeedCtl", ['$scope', 'dsEdit','$ocLazyLoad','$timeout', function ($scope, dsEdit, $ocLazyLoad, $timeout) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    /*限速类型*/
    $scope.speedType = [
        {"id": 0, "label": "普通(General)"},
        {"id": 1, "label": "指示牌(Advisory)"},
        {"id": 2, "label": "减速带(Speed Bumps Present)"},
        {"id": 3, "label": "特定条件(Dependent)"}
    ];
    /*限速条件*/
    $scope.speedDependent = [
        {id: 0, label: '无'},
        {id: 1, label: '雨天(Rain)'},
        {id: 2, label: '雪天(Snow)'},
        {id: 3, label: '雾天(Fog)'},
        {id: 6, label: '学校(School)'},
        {id: 10, label: '时间限制(Time-Dependent)'},
        {id: 11, label: '车道限制(Line-Dependent)'},
        {id: 12, label: '季节时段(Aproximate Seasonal Time)'}
    ];
    /*限速条件*/
    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)","checked":false},
        {"id": 1, "label": "配送卡车","checked":false},
        {"id": 2, "label": "运输卡车","checked":false},
        {"id": 3, "label": "步行者","checked":false},
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
        {"id": 20, "label": "载有其它危险品的车辆","checked":false},
        {"id": 21, "label": "电车","checked":false},
        {"id": 22, "label": "轻轨","checked":false},
        {"id": 23, "label": "校车","checked":false},
        {"id": 24, "label": "四轮驱动车","checked":false},
        {"id": 25, "label": "装有防雪链的车","checked":false},
        {"id": 26, "label": "邮政车","checked":false},
        {"id": 27, "label": "槽罐车","checked":false},
        {"id": 28, "label": "残疾人车","checked":false}
    ];


    //加载车辆类型;
    $ocLazyLoad.load('scripts/components/road/ctrls/attr_variableSpeed_ctrl/carTypeCtrl').then(function() {
        $scope.carPopoverURL = '../../../scripts/components/road/tpls/attr_variableSpeed_tpl/carTypeTpl.html';
    });
    //初始化函数;
	$scope.initializeData = function () {
        //orging Data
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.variableSpeed = objCtrl.data//.getIntegrate();
        eventController.fire(eventController.eventTypes.SELECTEDVEHICLECHANGE)
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.variableSpeedForm) {
            $scope.variableSpeedForm.$setPristine();
        }
        //十进制转二进制;
		conversionSystem();
        var highLightFeatures = [];
        //进入线;
        highLightFeatures.push({
            id: $scope.variableSpeed.inLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#21ed25'}
        });
        //进入点;
        highLightFeatures.push({
            id: $scope.variableSpeed.nodePid.toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {color: 'yellow',size:12}
        });
        //退出线
        highLightFeatures.push({
            id: $scope.variableSpeed.outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {size: 5}
        });
        //接续线
        if($scope.variableSpeed.vias.length)
        for(var i=0;i<$scope.variableSpeed.vias.length;i++){
            highLightFeatures.push({
                id: $scope.variableSpeed.vias[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {size: 5,color:'blue'}
            });
        }
        //高亮可变限速图标;
        highLightFeatures.push({
            id:$scope.variableSpeed.pid.toString(),
            layerid:'relationData',
            type:'relationData',
            style:{}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
	};

    /*十进制转二进制*/
    function conversionSystem() {
        var temp = parseInt(objCtrl.data.location, 10).toString(2);//$scope.variableSpeed.location
        switch (temp.length){
            case 1:
                temp = '00'+temp;
                break;
            case 2:
                temp = '0'+temp;
                break;
        }
        $scope.variableSpeed.locationTop = parseInt(temp[0])?true:false;
        $scope.variableSpeed.locationRight = parseInt(temp[1])?true:false;
        $scope.variableSpeed.locationLeft = parseInt(temp[2])?true:false;
    }

	/*二进制转十进制*/
	function bin2dec(bin) {
		c = bin.split("");
		len = c.length;
		dec = 0;
		for (i = 0; i < len; i++) {
			temp = 1;
			if (c[i] == 1) {
				for (j = i + 1; j < len; j++) temp *= 2;
				dec += temp;
			} else if (c[i] != 0) {
				return false;
			}
		}
		return dec;
	}

	$scope.save = function () {
		objCtrl.data.location = bin2dec(Number($scope.variableSpeed.locationTop) + '' + Number($scope.variableSpeed.locationRight) + '' + Number($scope.variableSpeed.locationLeft));
        if($scope.variableSpeed.speedValue>9999){
            swal("警告", '限速值超过最大值！', "warning");
            return;
        }
        objCtrl.save();
		if (!objCtrl.changedProperty) {
			swal("提示", '属性值没有变化！', "warning");
			return;
		}
		var param = {
			"command": "UPDATE",
			"type": "RDVARIABLESPEED",
			"dbId": App.Temp.dbId,
			"data": objCtrl.changedProperty
		};
		dsEdit.save(param).then(function (data) {
			if (data) {
                relationData.redraw();
                $scope.initializeData();
                if($scope.variableSpeedForm) {
                    $scope.variableSpeedForm.$setPristine();
                }
			}
		})
	};

	$scope.delete = function () {
		var objId = parseInt($scope.variableSpeed.pid);
		var param = {
			"command": "DELETE",
			"type": "RDVARIABLESPEED",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.variableSpeed = null;
                relationData.redraw();
                highRenderCtrl.highLightFeatures = null
                highRenderCtrl._cleanHighLight();
                $scope.resetToolAndMap();
                $scope.$emit('SWITCHCONTAINERSTATE',{
                    'subAttrContainerTpl':false,
                    'attrContainerTpl':false
                });
			}
		})
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
	};
	$scope.cancel = function () {};
    if (objCtrl.data) {
        $scope.initializeData();
    }
	eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
	eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
	eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
	eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
