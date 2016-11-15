/**
 * Created by liwanchong on 2016/3/3.
 */
var conditionSpeedApp = angular.module('app');
conditionSpeedApp.controller('conditionSpeedController', function ($scope, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    $scope.speedLimitsData = objCtrl.data.speedlimits;
    $scope.selectIndex = featCodeCtrl.getFeatCode().index;
    $scope.roadlinkData = objCtrl.data;
    $scope.oridiData = $scope.speedLimitsData[$scope.selectIndex];
    $scope.rticDir = objCtrl.data.direct;
    // for(var i= 0,len=$scope.speedLimitsData.length;i<len;i++) {
    //     if($scope.speedLimitsData[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
    //         $scope.oridiData = $scope.speedLimitsData[i];
    //     }
    // }
    // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if ($scope.conditForm) {
        $scope.conditForm.$setPristine();
    }
    $scope.auxiFlagoption = [
        { id: 0, label: '无' },
        { id: 55, label: '服务区内道路' },
        { id: 56, label: '环岛IC链接路' },
        { id: 58, label: '补助道路' },
        { id: 70, label: 'JCT道路名删除' },
        { id: 71, label: '线假立交' },
        { id: 72, label: '功能面关联道路' },
        { id: 73, label: '环岛直连MD' },
        { id: 76, label: '7级降8级标志' },
        { id: 77, label: '交叉点间Link' }
    ];

    $scope.toolinfoOption = [
        { id: 0, label: '未调查' },
        { id: 1, label: '收费' },
        { id: 2, label: '免费' },
        { id: 3, label: '收费道路的免费区间' }
    ];
    $scope.fromOfWayOption = [
        { id: '0', label: '未调查' },
        { id: '1', label: '无属性' },
        { id: '2', label: '其他' },
        { id: '10', label: 'IC' },
        { id: '11', label: 'JCT' },
        { id: '12', label: 'SA' },
        { id: '13', label: 'PA' },
        { id: '14', label: '全封闭道路' },
        { id: '15', label: '匝道' },
        { id: '16', label: '跨线天桥' },
        { id: '17', label: '跨线地道' },
        { id: '18', label: '私道' },
        { id: '20', label: '步行街' },
        { id: '21', label: '过街天桥' },
        { id: '22', label: '公交专用道' },
        { id: '23', label: '自行车道' },
        { id: '24', label: '跨线立交桥' },
        { id: '30', label: '桥' },
        { id: '31', label: '隧道' },
        { id: '32', label: '立交桥' },
        { id: '33', label: '环岛' },
        { id: '34', label: '辅路' },
        { id: '35', label: '掉头口' },
        { id: '36', label: 'POI连接路' },
        { id: '37', label: '提右' },
        { id: '38', label: '提左' },
        { id: '39', label: '主辅路入口' },
        { id: '43', label: '窄道路' },
        { id: '48', label: '主路' },
        { id: '49', label: '侧道' },
        { id: '50', label: '交叉点内道路' },
        { id: '51', label: '未定义交通区域' },
        { id: '52', label: '区域内道路' },
        { id: '53', label: '停车场出入口连接路' },
        { id: '54', label: '停车场出入口虚拟连接路' },
        { id: '57', label: 'Highway对象外JCT' },
        { id: '60', label: '风景路线' },
        { id: '80', label: '停车位引导道路' },
        { id: '81', label: '停车位引导道路' },
        { id: '82', label: '虚拟提左提右' }
    ];
    $scope.speedTypeOption = [
        { id: 0, label: '普通' },
        { id: 1, label: '指示牌' },
        { id: 3, label: '特定条件' }
    ];
    $scope.speedDependentOption = [
        { id: 0, label: '无' },
        { id: 1, label: '雨天' },
        { id: 2, label: '雪天' },
        { id: 3, label: '雾天' },
        { id: 6, label: '学校' },
        { id: 10, label: '时间限制' },
        { id: 11, label: '车道限制' },
        { id: 12, label: '季节时段' },
        { id: 13, label: '医院' },
        { id: 14, label: '购物' },
        { id: 15, label: '居民区' },
        { id: 16, label: '企事业单位' },
        { id: 17, label: '景点景区' },
        { id: 18, label: '交通枢纽' }
    ];
    $scope.fromLimitSrcOption = [
        { id: 0, label: '无' },
        { id: 1, label: '现场标牌' },
        { id: 2, label: '城区标识' },
        { id: 3, label: '高速标识' },
        { id: 4, label: '车道限速' },
        { id: 5, label: '方向限速' },
        { id: 6, label: '机动车限速' },
        { id: 7, label: '匝道未调查' },
        { id: 8, label: '缓速行驶' },
        { id: 9, label: '未调查' }
    ];
    $scope.speedClassOption = [
        { id: 0, label: '未赋值' },
        { id: 1, label: '>130' },
        { id: 2, label: '[100.1~130]' },
        { id: 3, label: '[90.1~100]' },
        { id: 4, label: '[70.1~90]' },
        { id: 5, label: '[50.1~70]' },
        { id: 6, label: '[30.1~50]' },
        { id: 7, label: '[11~30]' },
        { id: 8, label: '<11' }
    ];
    $scope.changeClass = function (item, dir) {
        var value = 0;
        if (dir == 2) {
            item.fromLimitSrc = 1;
            // value = parseFloat(item.fromSpeedLimit);
            // if (item.toSpeedLimit && (item.toSpeedLimit < item.fromSpeedLimit)) {
            //     value = parseFloat(item.toSpeedLimit);
            // }
        } else if (dir == 3) {
            item.toLimitSrc = 1;
            // value = parseFloat(item.toSpeedLimit);
            // if (item.fromSpeedLimit && (item.fromSpeedLimit < item.toSpeedLimit)) {
            //     value = parseFloat(item.fromSpeedLimit);
            // }
        }
        //
        // if(value < 11 && value >= 0){
        //     item.speedClass = 8;
        // }else if(value <= 30 && value >= 11){
        //     item.speedClass = 7;
        // }else if(value <= 50 && value >= 30.1){
        //     item.speedClass = 6;
        // }else if(value <= 70 && value >= 50.1){
        //     item.speedClass = 5;
        // }else if(value <= 90 && value >= 70.1){
        //     item.speedClass = 4;
        // }else if(value <= 100 && value >= 90.1){
        //     item.speedClass = 3;
        // }else if(value <= 130 && value >= 100.1){
        //     item.speedClass = 2;
        // }else if(value > 130){
        //     item.speedClass = 1;
        // }else {
        //     item.speedClass = 0;
        // }
        // item.speedClassWork = 1;
    };

    $scope.changeClassWork = function (item) {
        // item.speedClassWork = 0;
    };
    $scope.angleOfLink = function (pointA, pointB) {
        var PI = Math.PI,
            angle;
        if ((pointA.x - pointB.x) === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };
    $scope.showDirect = function (direct) {
        if ($scope.rticDir != 1) {
            return;
        }
        if (direct == 3) {
            direct = 1;
        }
        // map.currentTool.disable();
        // map.currentTool = shapeCtrl.getCurrentTool();
        // map.currentTool.enable();
        var containerPoint;
        var point = { x: $scope.roadlinkData.geometry.coordinates[0][0], y: $scope.roadlinkData.geometry.coordinates[0][1] };
        var pointVertex = { x: $scope.roadlinkData.geometry.coordinates[1][0], y: $scope.roadlinkData.geometry.coordinates[1][1] };
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        if (containerPoint.x < pointVertex.x || (containerPoint.x == pointVertex.x && containerPoint.y > pointVertex.y)) {
            angle = angle + Math.PI;
        }
        var marker = {
            flag: false,
            pid: $scope.roadlinkData.pid,
            point: point,
            type: 'intRticMarker',
            angle: angle,
            orientation: direct.toString()
        };
        layerCtrl.pushLayerFront('edit');
        editLayer.drawGeometry = marker;
        editLayer.draw(marker, editLayer);
    };
    $scope.hideDirect = function () {
        if ($scope.rticDir != 1) {
            return;
        }
        editLayer.drawGeometry = null;
        editLayer.bringToBack();
        editLayer.clear();
    };
    $scope.addSpeedLimit = function () {
        var newLimits = new fastmap.dataApi.linkspeedlimit({ linkPid: objCtrl.data.pid, speedType: 3 });
        $scope.speedLimitsData.unshift(newLimits);
    };
    $scope.minusSpeedlimit = function (id) {
        $scope.speedLimitsData.splice(id, 1);
        if ($scope.speedLimitsData.length === 0) {
        }
    };

    $scope.changeColor = function (ind) {
        $('#minusSpan' + ind).css('color', '#FFF');
    };
    $scope.backColor = function (ind) {
        $('#minusSpan' + ind).css('color', 'darkgray');
    };
    function timeoutLoad() {
        $timeout(function () {
            $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
                $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                $ocLazyLoad.load('scripts/components/road/ctrls/attr_link_ctrl/carPopoverCtrl').then(function () {
                    $scope.carPopoverURL = '../../../scripts/components/road/tpls/attr_link_tpl/carPopoverTpl.html';
                });
                /* 查询数据库取出时间字符串*/
                $timeout(function () {
                    $scope.fmdateTimer($scope.oridiData.timeDomain);
                    $scope.$broadcast('set-code', $scope.oridiData.timeDomain);
                    if ($scope.oridiData.type == 8 || $scope.oridiData.type == 9) {
                        $scope.$broadcast('btn-control', {
                            empty: 'hide',
                            add: 'hide',
                            delete: 'hide'
                        });
                    }
                    $scope.$apply();
                }, 100);
            });
        });
    }
    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.oridiData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.oridiData.timeDomain = str;
            $scope.$apply();
        }, 100);
    };
    timeoutLoad();
    // $scope.$on('refreshPage',function(data){
    //     $scope.speedLimitsData = objCtrl.data.speedlimits;
    //     $scope.realtimeData = objCtrl.data;
    //     $scope.oridiData = $scope.speedLimitsData[$scope.realtimeData["oridiRowId"]];
    // });
});
