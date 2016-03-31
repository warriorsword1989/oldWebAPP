/**
 * Created by liuzhaoxia on 2016/3/31.
 */
var oridinaryInfoApp = angular.module("myApp", []);
oridinaryInfoApp.controller("carController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.linkData = objCtrl.data;

    $scope.carData=[];
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
    /*********如果窗口打开状态，窗口关闭*/
    if($('body .datetip:last').show()){
        $('body .datetip:last').hide()
    }

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
        for(var p in originArray){
            for(var s in $scope.vehicleOptions){
                if(originArray[p].id.toString()==$scope.vehicleOptions[s].id){
                    $scope.vehicleOptions[s].checked=true;
                    $scope.carData.push($scope.vehicleOptions[s]);
                }
            }
        }
        //$scope.carData=originArray;

        //初始化数据
        // initOrig(originArray,$scope.vehicleOptions,"vehicleExpressiondiv");

    }


    for(var i= 0,len=$scope.linkData.limits.length;i<len;i++) {
        if($scope.linkData.limits[i]["rowId"]===$scope.linkData["oridiRowId"]) {
            $scope.oridiData = $scope.linkData.limits[i];
            $scope.limitNum = i;
            $scope.showvehicle($scope.linkData.limits[i].vehicle);
        }
    }


    $scope.showPopover=function(e){
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        $('body').append($(e.target).parents(".date-well").find(".datetip"));
        if($('body .datetip:last').css('display') == 'none'){
            $(".datetip").css({'top':($(e.target).offset().top-100)+'px','right':(dateTimeWell.attr('data-type')==1)?'300px':'600px'});
            $('body .datetip:last').show();
           //initOrig($scope.carData,$scope.vehicleOptions,"carDiv");
           // $("#carDiv").append(ContentMethod($scope.carData,$scope.vehicleOptions));
        }else{
            $('body .datetip:last').hide();
       }

    }

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
    }

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

        $scope.oridiData.vehicle=parseInt(bin2dec(result));
    }
})