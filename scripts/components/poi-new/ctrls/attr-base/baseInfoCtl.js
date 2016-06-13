angular.module('app').controller('baseInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {
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
    }

    var checkLevel = function (level){
        //$scope.poi.level = "";//清空等级
        $scope.levelArr = [];
        if (level) {
            $scope.levelArr = level.split("|");
            if($scope.levelArr.length == 1){ //如果只有一个等级，默认选中
                $scope.poi.level = level;
            }
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
        meta.getChainLevel($scope.poi.kindCode,obj.selectedChain).then(function (dataLevel){
            if (dataLevel) {
                checkLevel(dataLevel);
            }
        });
    }

    $scope.addContact = function() {
        $scope.poi.contacts.push(
            new FM.dataApi.IxPoiContact({
                contactType: 1,
                code: "010",
                contact: ""
            })
        );

    };
    $scope.deleteContact = function(index) {
        $scope.poi.contacts.splice(index, 1);
    };
    $scope.controlFlag.isTelEmptyArr = [];//用于保存时对电话的校验
    $scope.checkTelNo = function (index,t){
        var temp = $scope.poi.contacts[index];
        if(temp.contact && !/^[0-9]*$/.test(temp.contact)){
            $scope.controlFlag.isTelEmptyArr[index] = true;
            return ;
        }else {
            $scope.controlFlag.isTelEmptyArr[index] = false;
        }
        if(temp.contact && temp.contact.length == 11 && /^1/.test(temp.contact)){
            temp.contactType = 2;
        }else {
            temp.contactType = 1;
        }
    };
    
}]);