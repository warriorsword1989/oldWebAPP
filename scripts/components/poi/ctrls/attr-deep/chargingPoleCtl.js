angular.module('app').controller('chargingPoleCtl', function($scope) {
    var chargeChain = {
        data:[]
    };
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    $scope.changeOpenType = function(event) {
        if (event.target.value == "1") {
            if (event.target.checked) {
                for (var key in $scope.charging.openType) {
                    if (key != "1") {
                        $scope.charging.openType[key] = false;
                    }
                }
            }
        } else if(event.target.value == "99"){
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
                $scope.charging.chain = chargeChain;
            }
            else {
                $scope.charging.chain = {};
            }
        } else {
            if (event.target.checked) {
                $scope.charging.openType["1"] = false;
            }
        }
    };
    $scope.initCheckbox = function(valueStr, retObj) {
        var tmp = valueStr ? valueStr.split("|") : [];
        for (var i = 0; i < tmp.length; i++) {
            retObj[tmp[i]] = true;
        }
    };
//    $scope.paymentArray = $scope.poi.chargingPole[0].paymentArray;
    $scope.charging = $scope.poi.chargingPole[0];
//    $scope.paymentArr = [
//         {id:"0",value:'其他',check:false},
//         {id:"1",value:'现金',check:false},
//         {id:"2",value:'信用卡',check:false},
//         {id:"3",value:'借记卡',check:false},
//         {id:"4",value:'特制充值卡',check:false},
//         {id:"5",value:'APP',check:false}
//         ];
//    if($scope.charging.payment.indexOf('|') > 0){
//    	var pDefaulArr = $scope.charging.payment.split('|');
//    	for(var i = 0;i<pDefaulArr.length;i++){
//    		for(var j = 0; j<$scope.paymentArr.length; j++){
//    			if(pDefaulArr[i] == $scope.paymentArr[j].id){
//    				$scope.paymentArr[j].check = true;
//    				break;
//    			}
//    		}
//    	}
//    }else{
//    	for(var j = 0; j<$scope.paymentArr.length; j++){
//			if($scope.charging.payment == $scope.paymentArr[j].id){
//				$scope.paymentArr[j].check = true;
//				break;
//			}
//		}
//    }
    $scope.initCheckbox($scope.charging.openType, $scope.charging.openType = {});
    $scope.initCheckbox($scope.charging.plugType, $scope.charging.plugType = {});
    $scope.initCheckbox($scope.charging.payment, $scope.charging.payment = {});
    //查询充电桩品牌列表
    $scope.$on("loaded",function (event, data) {
        FM.dataApi.ajax.get("charge/row_edit/queryChain/", {
            kindCode: data.kindCode
        }, function(data) {
            if (data.errcode == 0) {
                for(var i = 0;i<data.data.length;i++){
                    chargeChain.data.push({
                        id:data.data[i].chainCode,
                        text:data.data[i].chainName
                    });
                }
            } else {
                chargeChain = {};
            }
            console.log(chargeChain);
        });
    });
    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "deepInfo");
    });
    
});