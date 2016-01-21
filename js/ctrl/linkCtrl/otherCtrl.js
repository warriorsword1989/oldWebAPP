/**
 * Created by navinfo on 2015/11/3.
 */

var otherApp=angular.module("lazymodule", []);
otherApp.controller("otherController",function($scope){
    $scope.roadlinkData=$scope.linkData;
    $scope.speedOfPopLength = 0;
    $scope.speedOfConLength = 0;
    $scope.newFromOfWRoadDate=[];
    for(var typeNum= 0,typeLen= $scope.roadlinkData.speedlimits.length;typeNum<typeLen;typeNum++) {
        if($scope.roadlinkData.speedlimits[typeNum].speedType===0) {
            $scope.speedOfPopLength++;
        }else if($scope.roadlinkData.speedlimits[typeNum].speedType===3) {
            $scope.speedOfConLength++;
        }
    }
    if( $scope.speedOfPopLength===0) {
        if($('#ptOrRightDiv').hasClass("in")) {
            $('#ptOrRightDiv').removeClass("in");
        }

    }
    if( $scope.speedOfConLength===0) {
        if ($('#tjOrRightDiv').hasClass("in")) {
            $('#tjOrRightDiv').removeClass("in");
        }
    }
    $("#button"+$scope.roadlinkData.isViaduct).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#specialbtn"+$scope.roadlinkData.specialTraffic).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#paveStatusbtn"+$scope.roadlinkData.paveStatus).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#adasFlagbtn"+$scope.roadlinkData.adasFlag).removeClass("btn btn-default").addClass("btn btn-primary");


    setTimeout(function() {
        for (var sitem in $scope.roadlinkData.speedlimits) {
            var flag = $scope.roadlinkData.speedlimits[sitem].speedClassWork;
            $("#speedClassWorkbtn" + flag + "_" + sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }

    },10)

    $scope.fromOfWayOption=[
        {"id":"0","label":"未调查"},
        {"id":"1","label":"无属性"},
        {"id":"2","label":"其他"},
        {"id":"10","label":"IC"},
        {"id":"11","label":"JCT"},
        {"id":"12","label":"SA"},
        {"id":"13","label":"PA"},
        {"id":"14","label":"全封闭道路"},
        {"id":"15","label":"匝道"},
        {"id":"16","label":"跨线天桥"},
        {"id":"17","label":"跨线地道"},
        {"id":"18","label":"私道"},
        {"id":"20","label":"步行街"},
        {"id":"21","label":"过街天桥"},
        {"id":"22","label":"公交专用道"},
        {"id":"23","label":"自行车道"},
        {"id":"24","label":"跨线立交桥"},
        {"id":"30","label":"桥"},
        {"id":"31","label":"隧道"},
        {"id":"32","label":"立交桥"},
        {"id":"33","label":"环岛"},
        {"id":"34","label":"辅路"},
        {"id":"35","label":"掉头口"},
        {"id":"36","label":"POI连接路"},
        {"id":"37","label":"提右"},
        {"id":"38","label":"提左"},
        {"id":"39","label":"主辅路入口"},
        {"id":"43","label":"窄道路"},
        {"id":"48","label":"主路"},
        {"id":"49","label":"侧道"},
        {"id":"50","label":"交叉点内道路"},
        {"id":"51","label":"未定义交通区域"},
        {"id":"52","label":"区域内道路"},
        {"id":"53","label":"停车场出入口连接路"},
        {"id":"54","label":"停车场出入口虚拟连接路"},
        {"id":"57","label":"Highway对象外JCT"},
        {"id":"60","label":"风景路线"},
        {"id":"80","label":"停车位引导道路"},
        {"id":"81","label":"停车位引导道路"},
        {"id":"82","label":"虚拟提左提右"}
    ];
    for(var p in $scope.roadlinkData.forms){
        for(var s in $scope.fromOfWayOption){
            if($scope.roadlinkData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
            }
        }
    }
    $scope.otherFromOfWay=[];
    //初始化数据
    initOrig($scope.newFromOfWRoadDate,$scope.fromOfWayOption,"fromOfWRoaddiv");
    //点击内容显示框时，关闭下拉，保存数据
    $("#fromOfWRoaddiv").click(function(){
        $("#fromOfWRoaddiv").popover('hide');
        $scope.endFromOfWayArray=getEndArray();
        for(var p in $scope.endFromOfWayArray){
            $scope.otherFromOfWay.push({
                formOfWay: $scope.endFromOfWayArray[p].id,
                linkPid:$scope.roadlinkData.pid
            })
        }
        $scope.roadlinkData.forms=$scope.otherFromOfWay;
    });

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
    $scope.saveroadname = function () {
        $scope.roadlinkData.forms.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            linkPid:$scope.roadlinkData.pid
        })

        $scope.newFromOfWRoadDate.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }
    $scope.deleteroadtype = function (type) {
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }

    $scope.addSpeedLimit = function () {
        $scope.speedOfConLength++;
        if (!$("#tjOrRightDiv").hasClass("in")) {
            $("#tjOrRightDiv").addClass("in");
        }
        $scope.roadlinkData.speedlimits.unshift({
            fromLimitSrc: 1,
            fromSpeedLimit: 0,
            linkPid: 0,
            rowid: "",
            speedClass: 5,
            speedClassWork: 0,
            speedDependent: 0,
            speedType: 3,
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

    $scope.showPopover=function(){
        $('#fromOfWRoaddiv').popover('show');
    }

   // $scope.savefromOfWay=function(){
       // $scope.roadlinkData.forms=getEdnArray();
    //}
});