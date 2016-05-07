/**
 * Created by liwanchong on 2016/3/3.
 */
var conditionSpeedApp = angular.module("myApp",[]);
conditionSpeedApp.controller("conditionSpeedController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.speedLimitsData = objCtrl.data.speedlimits;
    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            $scope.conditForm.$setPristine();
        });
    }
    $scope.realtimeData = objCtrl.data;
    for(var i= 0,len=$scope.speedLimitsData.length;i<len;i++) {
        if($scope.speedLimitsData[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
            $scope.oridiData = $scope.speedLimitsData[i];
        }
    }
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
    $scope.fromOfWayOption = [
        {"id": "0", "label": "未调查"},
        {"id": "1", "label": "无属性"},
        {"id": "2", "label": "其他"},
        {"id": "10", "label": "IC"},
        {"id": "11", "label": "JCT"},
        {"id": "12", "label": "SA"},
        {"id": "13", "label": "PA"},
        {"id": "14", "label": "全封闭道路"},
        {"id": "15", "label": "匝道"},
        {"id": "16", "label": "跨线天桥"},
        {"id": "17", "label": "跨线地道"},
        {"id": "18", "label": "私道"},
        {"id": "20", "label": "步行街"},
        {"id": "21", "label": "过街天桥"},
        {"id": "22", "label": "公交专用道"},
        {"id": "23", "label": "自行车道"},
        {"id": "24", "label": "跨线立交桥"},
        {"id": "30", "label": "桥"},
        {"id": "31", "label": "隧道"},
        {"id": "32", "label": "立交桥"},
        {"id": "33", "label": "环岛"},
        {"id": "34", "label": "辅路"},
        {"id": "35", "label": "掉头口"},
        {"id": "36", "label": "POI连接路"},
        {"id": "37", "label": "提右"},
        {"id": "38", "label": "提左"},
        {"id": "39", "label": "主辅路入口"},
        {"id": "43", "label": "窄道路"},
        {"id": "48", "label": "主路"},
        {"id": "49", "label": "侧道"},
        {"id": "50", "label": "交叉点内道路"},
        {"id": "51", "label": "未定义交通区域"},
        {"id": "52", "label": "区域内道路"},
        {"id": "53", "label": "停车场出入口连接路"},
        {"id": "54", "label": "停车场出入口虚拟连接路"},
        {"id": "57", "label": "Highway对象外JCT"},
        {"id": "60", "label": "风景路线"},
        {"id": "80", "label": "停车位引导道路"},
        {"id": "81", "label": "停车位引导道路"},
        {"id": "82", "label": "虚拟提左提右"}
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
    $scope.addSpeedLimit = function () {
        var newLimits = new fastmap.dataApi.linkspeedlimit({"linkPid":objCtrl.data.pid,"speedType":3});
        $scope.speedLimitsData.unshift(newLimits);

    };
    $scope.minusSpeedlimit = function (id) {
        $scope.speedLimitsData.splice(id, 1);
        if ( $scope.speedLimitsData.length === 0) {
        }
    };

    $scope.changeColor=function(ind){
        $("#minusSpan"+ind).css("color","#FFF");
    }
    $scope.backColor=function(ind){
        $("#minusSpan"+ind).css("color","darkgray");
    }
})