/**
 * Created by navinfo on 2015/11/3.
 */

var otherApp=angular.module("lazymodule", []);
otherApp.controller("otherController",function($scope){
    $scope.roadlinkData=$scope.linkData;
    $scope.newFromOfWRoadDate=[];

    $("#button"+$scope.roadlinkData.isViaduct).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#specialbtn"+$scope.roadlinkData.specialTraffic).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#paveStatusbtn"+$scope.roadlinkData.paveStatus).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#adasFlagbtn"+$scope.roadlinkData.adasFlag).removeClass("btn btn-default").addClass("btn btn-primary");
    //for(var sitem in $scope.roadlinkData.speedlimits){
    //    var flag=$scope.roadlinkData.speedlimits[sitem].speedClassWork;
    //    setTimeout(function(){
    //        $("#speedClassWorkbtn"+flag+"_"+sitem).removeClass("btn btn-default").addClass("btn btn-primary");
    //    },1000)
    //}

    $scope.fromOfWayOption=[
        {id:"0",name:"未调查"},
        {id:"1",name:"无属性"},
        {id:"2",name:"其他"},
        {id:"10",name:"IC"},
        {id:"11",name:"JCT"},
        {id:"12",name:"SA"},
        {id:"13",name:"PA"},
        {id:"14",name:"全封闭道路"},
        {id:"15",name:"匝道"},
        {id:"16",name:"跨线天桥"},
        {id:"17",name:"跨线地道"},
        {id:"18",name:"私道"},
        {id:"20",name:"步行街"},
        {id:"21",name:"过街天桥"},
        {id:"22",name:"公交专用道"},
        {id:"23",name:"自行车道"},
        {id:"24",name:"跨线立交桥"},
        {id:"30",name:"桥"},
        {id:"31",name:"隧道"},
        {id:"32",name:"立交桥"},
        {id:"33",name:"环岛"},
        {id:"34",name:"辅路"},
        {id:"35",name:"掉头口"},
        {id:"36",name:"POI连接路"},
        {id:"37",name:"提右"},
        {id:"38",name:"提左"},
        {id:"39",name:"主辅路入口"},
        {id:"43",name:"窄道路"},
        {id:"48",name:"主路"},
        {id:"49",name:"侧道"},
        {id:"50",name:"交叉点内道路"},
        {id:"51",name:"未定义交通区域"},
        {id:"52",name:"区域内道路"},
        {id:"53",name:"停车场出入口连接路"},
        {id:"54",name:"停车场出入口虚拟连接路"},
        {id:"57",name:"Highway对象外JCT"},
        {id:"60",name:"风景路线"},
        {id:"80",name:"停车位引导道路"},
        {id:"81",name:"停车位引导道路"},
        {id:"82",name:"虚拟提左提右"}
    ];
    for(var p in $scope.roadlinkData.forms){
        for(var s in $scope.fromOfWayOption){
            if($scope.roadlinkData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
            }
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
        {"id":3,"lable":"收费道路的免费区间"}
    ];
    $scope.speedTypeOption=[
        {"id":0,"label":"普通"},
        {"id":1,"label":"指示牌"},
        {"id":3,"label":"特定条件"}
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

    $scope.speedDependentOption = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 9, "label": "不应用"}
    ];

    console.log("$scope.newFromOfWRoadDate "+$scope.newFromOfWRoadDate);
    $scope.saveroadname = function () {
        $scope.roadlinkData.forms.push({
            id: $("#roadtypename").find("option:selected").val()
        })
        $scope.newFromOfWRoadDate.push({
            id: $("#roadtypename").find("option:selected").val(),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }
    $scope.deleteroadtype = function (type) {
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }

    $scope.addSpeedLimit = function () {
        if (!$("#tjOrRightDiv").hasClass("in")) {
            $("#tjOrRightDiv").addClass("in");
        }
        $scope.roadlinkData.speedlimits.unshift({
            fromLimitSrc: 1,
            fromSpeedLimit: 0,
            linkPid: 0,
            rowId: "",
            speedClass: 5,
            speedClassWork: 0,
            speedDependent: 0,
            speedType: 0,
            timeDomain: "",
            toLimitSrc: 0,
            toSpeedLimit: 0
        });

    }
    $scope.minusSpeedlimit = function (id) {
        $scope.roadlinkData.speedlimits.splice(id, 1);
        if ($scope.roadlinkData.speedlimits.length === 0) {
            if ($("#tjOrRightDiv").hasClass("in")) {
                $("#tjOrRightDiv").removeClass("in");
            }
        }
    };
    $scope.qkdifGroupId=function(){
        $("#difGroupIdText").val("");
    }
    $scope.checkSpecialTraffic=function(flag){
        $("#specialTrafficdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#specialbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.roadlinkData.specialTraffic=flag;
    }
    $scope.changecheck=function(flag){
        $("#isViaductdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#button"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.roadlinkData.isViaduct=flag;
    }
    $scope.checkPaveStatus=function (flag){
        $("#paveStatusdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#paveStatusbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary ");
        $scope.roadlinkData.paveStatus=flag;
    }
    $scope.checkAdasFlag=function(flag){
        $("#adasFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#adasFlagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.roadlinkData.adasFlag=flag;
    }
    $scope.checkspeedClassWork=function(flag,item,index){
        $("#speedClassWorkdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#speedClassWorkbtn"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.speedClassWork=flag;
    }

});