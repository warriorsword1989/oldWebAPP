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
    $scope.charging = $scope.poi.chargingPole[0];
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