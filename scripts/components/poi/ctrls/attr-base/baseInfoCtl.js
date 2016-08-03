angular.module('app').controller('baseInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'dsMeta', function($scope, $ocll, $q, dsMeta) {
    var pKindFormat = {}, pKindList = [] ,pAllChain = {};

    pKindList = $scope.$parent.metaData.kindList;
    pKindFormat = $scope.$parent.metaData.kindFormat;
    pAllChain = $scope.$parent.metaData.allChain;


    //初始化时让分类、品牌默认选中
    $scope.$watch('poi.kindCode', function (newVlaue, oldValue) {
        $scope.selectedKind = newVlaue;
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
    });
    /*初始化品牌*/
    var initChain = function(kindCode) {
        var chainArray = pAllChain[kindCode];
        $scope.chainList = {};
        if (chainArray) {
            chainArray.unshift({
                "chainCode": "0",
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


    var checkLevel = function (level){
        //$scope.poi.level = "";//清空等级
        $scope.levelArr = [];
        if (level) {
            $scope.levelArr = level.split("|");
        }
    }

    /*切换 分类（种别）*/
    $scope.kindChange = function(evt, obj) {
        $scope.poi.kindCode = obj.selectedKind; //会触发$scope.$watch('poi.kindCode'方法
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
    }

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
    //$scope.controlFlag.isTelEmptyArr = [];//用于保存时对电话的校验
    $scope.checkTelNo = function (index,t){
        var temp = $scope.poi.contacts[index];
        if( !/^[0-9]*$/.test(temp.contact)){
            swal("保存提示","电话填写不正确,不能保存！","warning");
            return ;
        }
        if(temp.contact && temp.contact.length == 11 && /^1/.test(temp.contact)){
            temp.contactType = 2;
        }else {
            temp.contactType = 1;
            if(temp.code){
                if($scope.$parent.teleCodeToLength[temp.code]){
                    if($scope.$parent.teleCodeToLength[temp.code] != temp.contact.length){
                        swal("提示","电话填写不正确,长度应该是"+$scope.$parent.teleCodeToLength[temp.code]+"位！","warning");
                    }
                    return ;
                }
                dsMeta.queryTelLength(temp.code).then(function (data){
                    if(data){
                        $scope.$parent.teleCodeToLength[temp.code] = data - temp.code.length;
                        if(temp.contact.length != $scope.$parent.teleCodeToLength[temp.code]){
                            swal("提示","电话填写不正确,长度应该是"+$scope.$parent.teleCodeToLength[temp.code]+"位！","warning");
                        }
                    }
                });
            } else {
                swal("保存提示","电话填写不正确,不能保存！","warning");
            }
        }
    };
    
}]);