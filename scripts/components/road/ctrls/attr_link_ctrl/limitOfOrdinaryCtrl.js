/**
 * Created by liwanchong on 2016/3/2.
 */
var oridinaryInfoApp = angular.module("mapApp");
oridinaryInfoApp.controller("ordinaryLimitController",function($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkData = objCtrl.data;

    if($(".ng-dirty")) {
        $.each($('.ng-dirty'), function (i, v) {
            if($scope.ordinaryLimitFrom!=undefined) {
                $scope.ordinaryLimitFrom.$setPristine();
            }
        });
    }
    $scope.appInfoOptions = [
        {"id": 0, "label": "调查中"},
        {"id": 1, "label": "可以通行"},
        {"id": 2, "label": "不可通行"},
        {"id": 3, "label": "未供用"},
        {"id": 5, "label": "计划"}
    ];
    $scope.typeOptions = [
        {"id": 0, "label": "道路维修中"},
        {"id": 1, "label": "单行限制"},
        {"id": 2, "label": "车辆限制"},
        {"id": 3, "label": "穿行限制"},
        {"id": 4, "label": "施工中不开放"},
        {"id": 5, "label": "季节性关闭道路"},
        {"id": 6, "label": "Usage Fee Required"},
        {"id": 8, "label": "外地车限行"},
        {"id": 9, "label": "尾号限行"}
    ];
    $scope.tollTypeOptions = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "收费道路"},
        {"id": 2, "label": "桥"},
        {"id": 3, "label": "隧道"},
        {"id": 4, "label": "公园"},
        {"id": 5, "label": "山径"},
        {"id": 6, "label": "风景路线"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.limitDirOptions = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "双方向"},
        {"id": 2, "label": "顺方向"},
        {"id": 3, "label": "逆方向"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.weatherOptions = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "雨天"},
        {"id": 2, "label": "雪天"},
        {"id": 3, "label": "雾天"},
        {"id": 9, "label": "不应用"}
    ];
    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)"},
        {"id": 1, "label": "配送卡车"},
        {"id": 2, "label": "运输卡车"},
        {"id": 3, "label": "步行车"},
        {"id": 4, "label": "自行车"},
        {"id": 5, "label": "摩托车"},
        {"id": 6, "label": "机动脚踏两用车"},
        {"id": 7, "label": "急救车"},
        {"id": 8, "label": "出租车"},
        {"id": 9, "label": "公交车"},
        {"id": 10, "label": "工程车"},
        {"id": 11, "label": "本地车辆"},
        {"id": 12, "label": "自用车辆"},
        {"id": 13, "label": "多人乘坐车辆"},
        {"id": 14, "label": "军车"},
        {"id": 15, "label": "有拖车的车"},
        {"id": 16, "label": "私营公共汽车"},
        {"id": 17, "label": "农用车"},
        {"id": 18, "label": "载有易爆品的车辆"},
        {"id": 19, "label": "载有水污染品的车辆"},
        {"id": 20, "label": "载有其他污染品的车辆"},
        {"id": 21, "label": "电车"},
        {"id": 22, "label": "轻轨"},
        {"id": 23, "label": "校车"},
        {"id": 24, "label": "四轮驱动车"},
        {"id": 25, "label": "装有防雪链的车"},
        {"id": 26, "label": "邮政车"},
        {"id": 27, "label": "槽罐车"},
        {"id": 28, "label": "残疾人车"}
    ];

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
        //初始化数据
       // initOrig(originArray,$scope.vehicleOptions,"vehicleExpressiondiv");


        //点击内容显示框时，关闭下拉，保存数据
        //$("#vehicleExpressiondiv"+sitem).click(function(){
        //    $("#vehicleExpressiondiv"+sitem).popover('hide');
        //    $scope.linkLimitData.limits[sitem].vehicle=getEndArray();
        //});

    }
    for(var i= 0,len=$scope.linkData.limits.length;i<len;i++) {
        if($scope.linkData.limits[i]["rowId"]===$scope.linkData["oridiRowId"]) {
            $scope.oridiData = $scope.linkData.limits[i];
            $scope.limitNum = i;
            $scope.showvehicle($scope.linkData.limits[i].vehicle);
        }
    }


    $scope.limitTypeChange=function(){
        for(var i= 0,len=$scope.linkData.limits.length;i<len;i++) {
            if($scope.linkData.limits[i]["rowId"]===$scope.linkData["oridiRowId"]) {
                $scope.linkData.limits[i].limitDir = 9;//切换限制类型时候，默认是不应用
                if($scope.linkData.limits[i].type!=6){//如果限制类型不为6时，收费类型都默认为不应用
                    $scope.linkData.limits[i].tollType = 9;
                }
                else{
                    //如果切换类型后，不需要赋默认值的，需要回到原来的值
                    for(var j= 0,oriLen=objCtrl.originalData.limits.length;j<oriLen;i++){
                        if(objCtrl.originalData.limits[j]["rowId"]===$scope.linkData["oridiRowId"]){
                            $scope.linkData.limits[i].tollType = objCtrl.originalData.limits[j].tollType;
                            break;
                        }
                    }
                }
                if($scope.linkData.limits[i].type==8||$scope.linkData.limits[i].type==9){//当
                    $timeout(function() {
                        $scope.$broadcast('btn-control', {'empty': 'hide', 'add': 'hide', 'delete': 'hide'});
                        $scope.$apply();
                    },100);
                }
                else{
                    $timeout(function() {
                        $scope.$broadcast('btn-control', {'empty': 'show', 'add': 'show', 'delete': 'show'});
                        $scope.$apply();
                    },100);
                }

                if($scope.linkData.limits[i].type==3){  //赋值方式逻辑处理
                    $scope.linkData.limits[i].processFlag = 2;
                }
                else if($scope.linkData.limits[i].type==0||$scope.linkData.limits[i].type==1||$scope.linkData.limits[i].type==2||$scope.linkData.limits[i].type==4||$scope.linkData.limits[i].type==5||$scope.linkData.limits[i].type==6||$scope.linkData.limits[i].type==7){
                    $scope.linkData.limits[i].processFlag = 0;
                }
                if($scope.linkData.limits[i].type==0||$scope.linkData.limits[i].type==4){ //录入时间
                    $scope.linkData.limits[i].inputTime = new Date().toLocaleString();
                }
                else{
                    //如果切换类型后，不需要赋默认值的，需要回到原来的值
                    for(var k= 0,oriLen=objCtrl.originalData.limits.length;k<oriLen;k++){
                        if(objCtrl.originalData.limits[k]["rowId"]===$scope.linkData["oridiRowId"]){
                            $scope.linkData.limits[i].inputTime = objCtrl.originalData.limits[k].inputTime;
                            break;
                        }
                    }
                }
                break;
            }
        }
    }

    $scope.showPopover=function(ind,vehicle){
        //initdiv('vehicleExpressiondiv');
        //$('#vehicleExpressiondiv').popover('show');
       // $(".popover-title").append("<button id='closeBut' onclick='javascript:closePopover()'>X</button>");
    }

    function closePopover(){
       $('#vehicleExpressiondiv').popover('hide');
    }

    $timeout(function(){
        $ocLazyLoad.load('components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            $ocLazyLoad.load('components/road/ctrls/attr_link_ctrl/carPopoverCtrl').then(function () {
                $scope.carPopoverURL = '../../scripts/components/road/tpls/attr_link_tpl/carPopoverTpl.html';
            });
            /*查询数据库取出时间字符串*/
            $timeout(function(){
                $scope.fmdateTimer($scope.linkData.limits[$scope.limitNum].timeDomain);
                $scope.$broadcast('set-code',$scope.linkData.limits[$scope.limitNum].timeDomain);
                if($scope.oridiData.type==8||$scope.oridiData.type==9){
                    $scope.$broadcast('btn-control',{'empty':'hide','add':'hide','delete':'hide'});
                }
                $scope.$apply();
            },100);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function(str){
        $scope.$on('get-date', function(event,data) {
            $scope.linkData.limits[$scope.limitNum].timeDomain = data;
        });
        $timeout(function(){
            $scope.$broadcast('set-code',str);
            $scope.linkData.limits[$scope.limitNum].timeDomain = str;
            $scope.$apply();
        },100);
    }

    $scope.checkViche=function(){
        $scope.applicArray = getEndArray();
        var newArray=[];
        var result="";
        for(var j=0;j<$scope.applicArray.length;j++){
            newArray.push($scope.applicArray[j].id);
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

        $scope.oridiData.vehicle=parseInt(bin2dec(result));
    }

    //$scope.applicArray = getEndArray();
    //$scope.$watchCollection('applicArray',function(newValue,oldValue, scope){
    //    console.log(newValue);
    //    var newArray=[];
    //    var result="";
    //    for(var j=0;j<newValue.length;j++){
    //        newArray.push(newValue[j].id);
    //    }
    //    for(var i=31;i>=0;i--){
    //        if(i==31){
    //            if($scope.checkValue){
    //                result+="1";//允许
    //            }else{
    //                result+="0";//禁止
    //            }
    //        }else{
    //            if($.inArray(i, newArray)!=-1){
    //                result+="1";
    //            }else{
    //                result+="0";
    //            }
    //        }
    //
    //    }
    //
    //    $scope.oridiData.vehicle=parseInt(bin2dec(result));
    //})

})