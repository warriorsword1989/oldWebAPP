/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("mapApp");
basicApp.controller("basicController",function($scope,$ocLazyLoad) {
    var selectCtrl = fastmap.uikit.SelectController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.kindOptions = [
        {"id": 0, "label": "0 作业中"},
        {"id": 1, "label": "1 高速道路"},
        {"id": 2, "label": "2 城市高速"},
        {"id": 3, "label": "3 国道"},
        {"id": 4, "label": "4 省道"},
        {"id": 5, "label": "5 预留"},
        {"id": 6, "label": "6 县道"},
        {"id": 7, "label": "7 乡镇村道路"},
        {"id": 8, "label": "8 其它道路"},
        {"id": 9, "label": "9 非引导道路"},
        {"id": 10, "label": "10 步行道路"},
        {"id": 11, "label": "11 人渡"},
        {"id": 13, "label": "13 轮渡"},
        {"id": 15, "label": "15 10级路(障碍物)"}
    ];
    $scope.laneClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "一条车道"},
        {"id": 2, "label": "2或3条"},
        {"id": 3,"label":"4条及以上"}
    ];
    $scope.imiCodeOptions = [
        {"id": 0, "label": "其他道路"},
        {"id": 1, "label": "交叉点内部道路"},
        {"id": 2, "label": "转弯道"},
        {"id": 3, "label": "无法描述的"}
    ];
    $scope.functionClassOptions = [
        {"id": 0, "label": "未赋值"},
        {"id": 1, "label": "等级1"},
        {"id": 2, "label": "等级2"},
        {"id": 3, "label": "等级3"},
        {"id": 4, "label": "等级4"},
        {"id": 5, "label": "等级5"}
    ];
    $scope.nameTypeOptions = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "立交桥名(链接路)"},
        {"id": 2, "label": "立交桥名(主路)"},
        {"id": 3, "label": "风景线路"},
        {"id": 4, "label": "桥"},
        {"id": 5, "label": "隧道"},
        {"id": 6, "label": "虚拟名称"},
        {"id": 7, "label": "出口编号"},
        {"id": 8, "label": "编号名称"},
        {"id": 9, "label": "虚拟连接名称"},
        {"id": 14, "label": "点门牌"},
        {"id": 15, "label": "线门牌"}
    ];
    $scope.speedTypeOption = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"}
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

    $scope.initOtherData = function(){
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                $scope.basicFrom.$setPristine();
            });

        }
        $scope.linkData = objectEditCtrl.data;
        $scope.newFromOfWRoadDate = [];
        if($scope.linkData.forms.length>0){
            $scope.auxiFlag=$scope.linkData.forms[0].auxiFlag;
            $scope.formOfWay=$scope.linkData.forms[0].formOfWay;
        }
        for(var p in $scope.linkData.forms){
            for(var s in $scope.fromOfWayOption){
                if($scope.linkData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                    $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
                }
            }
        }
    }
    if(objectEditCtrl.data) {
        $scope.initOtherData();
    }
    objectEditCtrl.updateObject=function() {
        $scope.initOtherData();
    }
    $scope.emptyGroupId = function () {
        $("#difGroupIdText").val("");
    }


    $scope.showNames=function() {
        var showNameObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/namesOfDetailCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/namesOfDetailTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showNameObj);
    };

    //修改道路形态
    $scope.addFormOfWay = function() {
        var addFormOfWayObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/basicOfFormWayCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/basicOfFormWayTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", addFormOfWayObj);
    };
    //过滤条件
    $scope.flag = 0;
    $scope.auxiFilter=function(item) {
        if(item.auxiFlag!==3) {
            $scope.flag += 1;
            if($scope.flag===$scope.linkData.forms.length) {
                $scope.flag = 0;
                return item.auxiFlag === 0;
            }
        }else{
            $scope.flag = 0;
            return item.auxiFlag === 3;
        }
    };


    $scope.typeoption=[
        {"id":0,"label":"未分类"},
        {"id":1,"label":"AOIZone"},
        {"id":2,"label":"KDZone"},
        {"id":3,"label":"GCZone"}
    ];
    $scope.showZoneWin=function(item){
        $scope.linkData["oridiRowId"] = item.rowId;
        var showZoneWinObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/infoOfZoneCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/infoOfZoneTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showZoneWinObj);
    }

    $scope.showZone=function(item){
        if (item == 0) {
            return;
        }else {
            var showZoneObj={
                "loadType":"subAttrTplContainer",
                "propertyCtrl":'components/road/ctrls/attr_link_ctrl/basicOfZoneCtrl',
                "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/basicOfZoneTpl.html'
            }
            $scope.$emit("transitCtrlAndTpl", showZoneObj);
        }
    }
    $scope.showOther=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_link_ctrl/basicOfOtherCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_link_tpl/basicOfOtherTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    }


})