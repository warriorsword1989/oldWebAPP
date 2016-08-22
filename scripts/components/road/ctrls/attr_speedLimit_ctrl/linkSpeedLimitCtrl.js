/**
 * Created by liuyang on 2016/8/18.
 */

var selectApp = angular.module("app");
selectApp.controller("linkSpeedlimitController", ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', function ($scope, $timeout, $ocLazyLoad, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var relationData = layerCtrl.getLayerById('rdLinkSpeedLimit');
    var eventController = fastmap.uikit.EventController();

    $scope.speedLimitsData = objCtrl.data;
    $scope.fromEditable = true;
    $scope.toEditable = true;
    if(objCtrl.data.fromSpeedLimit == 0){
        $scope.fromEditable = false;
    }
    if(objCtrl.data.toSpeedLimit == 0){
        $scope.toEditable = false;
    }
    // $scope.carSpeedType = false;
    // $scope.initializeData = function () {
    //
    // };
    // if (objCtrl.data) {
    //     $scope.initializeData();
    // }
    $scope.auxiFlagoption=[
        {"id":0,"label":"无"},
        {"id":55,"label":"服务区内道路"},
        {"id":56,"label":"环岛IC链接路"},
        {"id":58,"label":"补助道路"},
        {"id":70,"label":"JCT道路名删除"},
        {"id":71,"label":"线假立交"},
        {"id":72,"label":"功能面关联道路"},
        {"id":73,"label":"环岛直连MD"},
        {"id":76,"label":"7级降8级标志"},
        {"id":77,"label":"交叉点间Link"}
    ];

    $scope.toolinfoOption=[
        {"id":0,"label":"未调查"},
        {"id":1,"label":"收费"},
        {"id":2,"label":"免费"},
        {"id":3,"label":"收费道路的免费区间"}
    ];
    $scope.speedTypeOption=[
        {"id":0,"label":"普通"},
        {"id":1,"label":"指示牌"},
        {"id":3,"label":"特定条件"}
    ];
    $scope.speedDependentOption = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 6, "label": "学校"},
        {"id": 10, "label": "时间限制"},
        {"id": 11, "label": "车道限制"},
        {"id": 12, "label": "季节时段"},
        {"id": 13, "label": "医院"},
        {"id": 14, "label": "购物"},
        {"id": 15, "label": "居民区"},
        {"id": 16, "label": "企事业单位"},
        {"id": 17, "label": "景点景区"},
        {"id": 18, "label": "交通枢纽"}
    ];
    $scope.fromLimitSrcOption=[
        {"id":0,"label":"未赋值"},
        {"id":1,"label":"现场标牌"},
        {"id":2,"label":"城区标识"},
        {"id":3,"label":"高速标识"},
        {"id":4,"label":"车道限速"},
        {"id":5,"label":"方向限速"},
        {"id":6,"label":"机动车限速"},
        {"id":7,"label":"匝道未调查"},
        {"id":8,"label":"缓速行驶"},
        {"id":9,"label":"未调查"}
    ];
    function timeoutLoad() {
        $timeout(function() {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function() {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/carPopoverCtrl').then(function() {
                    $scope.carPopoverURL = '../../../scripts/components/road/tpls/attr_link_tpl/carPopoverTpl.html';
                });
                /*查询数据库取出时间字符串*/
                $timeout(function() {
                    $scope.fmdateTimer($scope.speedLimitsData.timeDomain);
                    $scope.$broadcast('set-code', $scope.speedLimitsData.timeDomain);
                    if ($scope.speedLimitsData.type == 8 || $scope.speedLimitsData.type == 9) {
                        $scope.$broadcast('btn-control', {
                            'empty': 'hide',
                            'add': 'hide',
                            'delete': 'hide'
                        });
                    }
                    $scope.$apply();
                }, 100);
            });
        });
    }
    /*时间控件*/
    $scope.fmdateTimer = function(str) {
        $scope.$on('get-date', function(event, data) {
            $scope.speedLimitsData.timeDomain = data;
        });
        $timeout(function() {
            $scope.$broadcast('set-code', str);
            $scope.speedLimitsData.timeDomain = str;
            $scope.$apply();
        }, 100);
    };
    timeoutLoad();

    $scope.save = function () {
        var linkSpeedLimitData = {
            linkPids:featCodeCtrl.getFeatCode().linkPids,
            direct:featCodeCtrl.getFeatCode().direct,
            linkSpeedLimit:{
                speedType:$scope.speedLimitsData.speedType,
                fromSpeedLimit:parseInt($scope.speedLimitsData.fromSpeedLimit)*10 || 0,
                fromLimitSrc:$scope.speedLimitsData.fromLimitSrc || 0,
                toSpeedLimit:parseInt($scope.speedLimitsData.toSpeedLimit)*10 || 0,
                toLimitSrc:$scope.speedLimitsData.toLimitSrc || 0,
                speedClassWork:$scope.speedLimitsData.speedClassWork
            }
        };

        var param = {
            "command": "BATCH",
            "type": "RDLINKSPEEDLIMIT",
            "dbId": App.Temp.dbId,
            "data": linkSpeedLimitData
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                relationData.redraw();
                swal("操作成功", "创建线限速成功！", "success");
            }
        })
    };
    $scope.delete = function () {

    };
    $scope.cancel = function () {

    };
    $scope.$on('refreshPage',function(data){
        $scope.speedLimitsData = objCtrl.data;
        $scope.fromEditable = true;
        $scope.toEditable = true;
        if(objCtrl.data.fromSpeedLimit == 0){
            $scope.fromEditable = false;
        }
        if(objCtrl.data.toSpeedLimit == 0){
            $scope.toEditable = false;
        }
    });
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);

}]);
