angular.module('app').controller('baseInfoCtl', ['$scope', '$ocLazyLoad', '$q', 'dsPoi','dsMeta', function($scope, $ocll, $q, poi, meta) {
    var pKindFormat = {}, pKindList = [] ,pAllChain = {};

    pKindList = $scope.$parent.metaData.kindList;
    pKindFormat = $scope.$parent.metaData.kindFormat;
    pAllChain = $scope.$parent.metaData.allChain;

    /*临时假数据*/
    $scope.poi.contacts = [{
        "priority": 1,
        "type": 1,
        "linkman": null,
        "weChatUrl": null,
        "number": "60509788",
        "code":"010"
    },
        {
            "priority": 2,
            "type": 1,
            "linkman": null,
            "weChatUrl": null,
            "number": "3456789",
            "code":"0314"
        },
        {
            "priority": 1,
            "type": 2,
            "linkman": null,
            "weChatUrl": null,
            "number": "18291898987",
            "code":""
        }]

    //初始化时让分类、品牌默认选中
    $scope.$watch('poi.kindCode', function (newVlaue, oldValue) {
        $scope.selectedKind = newVlaue;
        for (var i = 0; i < pKindList.length; i++) {
            if (pKindList[i].value == newVlaue) {
                initChain(newVlaue);
                if ($scope.poi.brands.length > 0) { //如果存在品牌则显示品牌
                    $scope.selectedChain = $scope.poi.brands[0].code;
                } else {
                    $scope.selectedChain = ""
                }
                var level = pKindFormat[newVlaue].level;
                checkLevel(level);
                break;
            }
        }
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
        $scope.poi.level = "";//清空等级
        $scope.levelArr = [];
        if (level) {
            $scope.levelArr = level.split("|");
            if($scope.levelArr.length == 1){ //如果只有一个等级，默认选中
                $scope.poi.level = level;
            }
        }
    }

    /*分类切换*/
    $scope.kindChange = function(evt, obj) {
        $scope.poi.kindCode = obj.selectedKind; //会触发$scope.$watch('poi.kindCode'方法
        $scope.poi.brands[0].code = "";
        $scope.$emit("kindChange", pKindFormat[obj.selectedKind]);
    };


    $scope.addContact = function() {
        $scope.poi.contacts.push({
            type: 1,
            code: "010",
            number: null
        });
    };
    $scope.deleteContact = function(index) {
        $scope.poi.contacts.splice(index, 1);
    };




}]);