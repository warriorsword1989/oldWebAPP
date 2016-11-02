angular.module('app').controller('baseInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'dsMeta', function($scope, $ocll, $q, dsMeta) {
    var pKindFormat = {}, pKindList = [] ,pAllChain = {};

    pKindList = $scope.$parent.metaData.kindList;
    pKindFormat = $scope.$parent.metaData.kindFormat;
    pAllChain = $scope.$parent.metaData.allChain;
    $scope.truckTypeOpt = FM.dataApi.Constant.truckType;
    //初始化时让分类、品牌默认选中
    $scope.$watch('poi.kindCode', function (newVlaue, oldValue) {
        //$scope.selectedKind = newVlaue;
        for (var i = 0; i < pKindList.length; i++) {
            if (pKindList[i].value == newVlaue) {
                initChain(newVlaue);
                if ($scope.poi.chain) { //如果存在品牌则显示品牌
                    $scope.selectedChain = $scope.poi.chain;
                } else {
                    $scope.selectedChain = ""
                }
                var level = pKindFormat[newVlaue].level;
                checkLevel(level);
                break;
            }
        }
        $scope.$emit("kindChange", pKindFormat[newVlaue]);
        $scope.getTruckByKindChain(newVlaue,"",null);
    });

    /*初始化品牌*/
    var initChain = function(kindCode) {
        var chainArray = pAllChain[kindCode];
        $scope.chainList = {};
        if (chainArray) {
            chainArray.unshift({
                "chainCode": "0", //增加默认值0，可以使 “--请选择--”显示在最前面
                "chainName": "--请选择--"
            });
            for (var i = 0, len = chainArray.length; i < len; i++) {
                var cha = chainArray[i];
                $scope.chainList[cha.chainCode] = { //转换成chosen-select可以解析的格式
                    "category": cha.category,
                    "chainCode": cha.chainCode,
                    "weight": cha.weight,
                    "chainName": cha.chainName
                }
            }
        }
    };

    $scope.rootCommonTemp.levelArr = [];
    var checkLevel = function (level){
        //$scope.poi.level = "";//清空等级
        $scope.rootCommonTemp.levelArr = [];
        if($scope.poi.kindCode == '120101'){ //星级酒店特殊处理,
            var rat = $scope.poi.hotels[0].rating;
            if(rat==5 || rat==15 || rat==4|| rat==14 || rat==6){
                $scope.rootCommonTemp.levelArr = ["A"];
                $scope.poi.level = "A";
            } else {
                $scope.rootCommonTemp.levelArr = ["B1"];
                $scope.poi.level = "B1";
            }
        } else {
            if (level) {
                $scope.rootCommonTemp.levelArr = level.split("|");
            }
            if(!$scope.poi.level || $scope.rootCommonTemp.levelArr.indexOf($scope.poi.level) < 0){
                $scope.poi.level = $scope.rootCommonTemp.levelArr[0];
            }
        }
    };

    /*切换 分类（种别）*/
    $scope.kindChange = function(evt, obj) {
        //$scope.poi.kindCode = obj.selectedKind; //会触发$scope.$watch('poi.kindCode'方法
        $scope.poi.chain = "";
    };
    /*切换 品牌*/
    $scope.brandChange = function (evt, obj){
        $scope.poi.chain = obj.selectedChain;
        dsMeta.getChainLevel($scope.poi.kindCode,obj.selectedChain).then(function (dataLevel){
            if (dataLevel) {
                checkLevel(dataLevel);
            }
        });
        $scope.getTruckByKindChain($scope.poi.kindCode,$scope.poi.chain,null)
    };

    $scope.addContact = function() {
        $scope.poi.contacts.reverse(); //反转
        $scope.poi.contacts.push(
            new FM.dataApi.IxPoiContact({
                contactType: 1,
                code: "010",
                contact: ""
            })
        );
        $scope.poi.contacts.reverse();
    };
    $scope.deleteContact = function(index) {
        $scope.poi.contacts.splice(index, 1);
    };
    $scope.checkTelNo = function (index,t){
        var temp = $scope.poi.contacts[index];
        if(temp.contact && !Utils.verifyNumber(temp.contact)){
            swal("保存提示","电话填写不正确,不能保存！","warning");
            return ;
        }
        if(Utils.verifyTelphone(temp.contact)){
            temp.contactType = 2;
        } else {
            temp.contactType = 1;
            if(temp.code && temp.contact){
                if($scope.$parent.teleCodeToLength[temp.code]){
                    if($scope.$parent.teleCodeToLength[temp.code] != temp.contact.length){
                        swal("提示","电话填写不正确,不算区号长度应该是"+$scope.$parent.teleCodeToLength[temp.code]+"位！","warning");
                    }
                    return ;
                }
                dsMeta.queryTelLength(temp.code).then(function (data){
                    if(data){
                        $scope.$parent.teleCodeToLength[temp.code] = data - temp.code.length;
                        if(temp.contact.length != $scope.$parent.teleCodeToLength[temp.code]){
                            swal("提示","电话填写不正确,不算区号长度应该是"+$scope.$parent.teleCodeToLength[temp.code]+"位！","warning");
                        }
                    } else {
                        $scope.$parent.teleCodeToLength[temp.code] = 0;
                        swal("保存提示","电话区号不正确,不能保存！","warning");
                    }
                });
            } else {
                //swal("保存提示","电话区号不正确,不能保存！","warning");
            }
        }
    };
    /**
     * 校验区号
     */
    $scope.checkTelAreaCode = function (index,t){
        var areaCode = $scope.poi.contacts[index].code;
        if(!$scope.$parent.teleCodeToLength[areaCode]){
            dsMeta.queryTelLength(areaCode).then(function (data){
                if(data){
                    $scope.$parent.teleCodeToLength[areaCode] = data - areaCode.length;
                } else {
                    $scope.$parent.teleCodeToLength[areaCode] = 0;
                    swal("保存提示","电话区号不正确,不能保存！","warning");
                }
            });
        }
    };
    /**
     * 名称为空或者长度大于35的校验
     */
    $scope.validataName = function (obj){
        var value = obj.target.value;
        if (!(value && value.length <= 35)) {
            swal("保存提示", '名称为必填项，且不能大于35个字符，请检查！', "warning");
        }
    }
}]);
