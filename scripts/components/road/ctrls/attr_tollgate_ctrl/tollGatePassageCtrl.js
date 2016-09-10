/**
 * Created by wangmingdong on 2016/8/10.
 */
var tollApp = angular.module("app");
tollApp.controller("TollGatePassageCtl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    /*领卡类型*/
    $scope.cardTypeObj = [
        {id:0,label:'未调查',name:'未调查'},
        {id:1,label:'ETC',name:'ETC通道'},
        {id:2,label:'人工',name:'人工通道'},
        {id:3,label:'自助',name:'自助通道'}
    ];
    /*收费方式*/
    //$scope.tollFormObj = [
    //    {id:0,label:'ETC',"checked":false},
    //    {id:1,label:'现金',"checked":false},
    //    {id:2,label:'银行卡（借记卡）',"checked":false},
    //    {id:3,label:'信用卡',"checked":false},
    //    {id:4,label:'IC卡',"checked":false},
    //    {id:5,label:'预付卡',"checked":false}
    //];
    /*汽车类型*/
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
    /*初始化*/
    $scope.initPassage = function(){
        $scope.tollGateInfo = objCtrl.data;
        $scope.passageIndex = 0;
        $scope.carData = [];
        $scope.chargeWay = [];
        $scope.isAllowed = [];
        for(var i=0,len=$scope.tollGateInfo.passages.length;i<len;i++){
            $scope.carData[i] = [];
            $scope.chargeWay[i] = [
                {id:0,label:'未调查',"checked":false},
                {id:1,label:'ETC',"checked":false},
                {id:2,label:'现金',"checked":false},
                {id:3,label:'银行卡（借记卡）',"checked":false},
                {id:4,label:'信用卡',"checked":false},
                {id:5,label:'IC卡',"checked":false},
                {id:6,label:'预付卡',"checked":false}
            ];;
            $scope.isAllowed[i] = false;
            showvehicle($scope.tollGateInfo.passages[i].vehicle,i);
            showChargeWay($scope.tollGateInfo.passages[i].tollForm,i)
        }
    };

    /**
     * 车辆类型复选并将选中的类型转化为二进制;
     * @param item
     */
    $scope.carSelect=function(item){
        if(item.checked){
            item.checked=false;
            for(var i in $scope.carData[$scope.passageIndex]){
                if($scope.carData[$scope.passageIndex][i].id.toString()==item.id){
                    $scope.carData[$scope.passageIndex].splice(i,1);
                }
            }
        }else{
            item.checked=true;
            $scope.carData[$scope.passageIndex].push(item);
        }
        $scope.checkViche();
    };

    /**
     *
     */
    $scope.selectChargeType = function(num){
        var newArray=[];
        var result="";
        for(var j=0;j<$scope.chargeWay[num].length;j++){
            if($scope.chargeWay[num][j].checked){
                newArray.push($scope.chargeWay[num][j].id);
            }
        }

        for(var i=6;i>=0;i--){
            if($.inArray(i, newArray)!=-1){
                result+="1";
            }else{
                result+="0";
            }
        }

        objCtrl.data.passages[num].tollForm=parseInt(bin2dec(result));
        console.log($scope.chargeWay[num])
        //$scope.checkViche();
    }

    /**
     *
     * @param vehicle
     * @param $index
     */
    function showvehicle(vehicle,$index){
        var towbin=dec2bin(vehicle);
        //循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray=[];
        //$scope.checkValue=false;
        $scope.isAllowed[$index] = false;
        var len=towbin.length-1;
        //长度小于32即是没有选中checkbox，不允许
        if(towbin.length<32){
            //$scope.checkValue=false;
            $scope.isAllowed[$index] = false;
        }else{
            len=towbin.length-2;
            //$scope.checkValue=true;
            $scope.isAllowed[$index] = true;
        }
        for(var i=len;i>=0;i--){
            if(towbin.split("").reverse().join("")[i]==1){
                originArray.push($scope.vehicleOptions[i]);
            }
        }
        if(originArray.length == 0){
            $scope.carData[$index] = [];
        } else {
            for(var p in originArray){
                for(var s in $scope.vehicleOptions){
                    if(originArray[p].id.toString()==$scope.vehicleOptions[s].id){
                        $scope.vehicleOptions[s].checked=true;
                        $scope.carData[$index].push($scope.vehicleOptions[s]);
                    }
                }
            }
        }
    };

    /**
     *
     * @param tollType
     * @param $index
     */
    function showChargeWay(tollType,$index){
        var towbin=dec2bin(tollType);
        if(towbin.length){
            for(var i=1;i<towbin.length;i++){
                if(towbin.split("").reverse().join("")[i]==1){
                    $scope.chargeWay[$index][i].checked = true;
                }
            }
        }else{
            $scope.chargeWay[$index][0].checked = true;
        }
    }

    $scope.showPopover=function(e,index){
        var dateTimeWell = $(e.target).parents('.fm-container').parent();
        $('body').append($(e.target).parents(".fm-container").find(".carTypeTip"));
        $(".carTypeTip").css({'top':($(e.target).offset().top-80)+'px','right':(dateTimeWell.attr('data-type')==1)?'300px':'600px'});
        $('body .carTypeTip:last').show();

        $scope.passageIndex = index;
        for(var i=0;i<$scope.vehicleOptions.length;i++){
            if($scope.vehicleOptions[i].checked){
                $scope.vehicleOptions[i].checked = !$scope.vehicleOptions[i].checked
            }
        }
        $scope.carData[$scope.passageIndex] = [];
        showvehicle($scope.tollGateInfo.passages[$scope.passageIndex].vehicle,index);
    };

    $scope.closePopover = function(){
        $('body .carTypeTip:last').hide();
    };



    $scope.checkViche=function(){
        var newArray=[];
        var result="";
        for(var j=0;j<$scope.carData[$scope.passageIndex].length;j++){
            newArray.push($scope.carData[$scope.passageIndex][j].id);
        }
        for(var i=31;i>=0;i--){
            if(i==31){
                if($scope.isAllowed[$scope.passageIndex]){
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
        objCtrl.data.passages[$scope.passageIndex].vehicle=parseInt(bin2dec(result));
    };

    $scope.changeAllowed = function(param){
        $scope.isAllowed[param] = !$scope.isAllowed[param];
        $scope.checkViche()
    }


    /*切换领卡类型*/
    $scope.changeCardType = function(){
        $scope.$emit('tollGateCardType',true);
    };

    $scope.initPassage();
    $scope.$on('refreshTollgatePassage',$scope.initPassage);

}]);
