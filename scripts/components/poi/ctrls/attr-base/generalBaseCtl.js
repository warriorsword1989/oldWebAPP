angular.module('app').controller('generalBaseCtl', ['$scope','$timeout','dsMeta',function($scope, $timeout,meta) {

    var pKindFormat = {}, pKindList,
        pAllChain = {};
    var regionCode = "010"
    var lifecycle = {
        1: "删 除",
        2: "修 改",
        3: "新 增",
        4: "未 知"
    };
    var auditStatus = {
        0: "无",
        1: "待审核",
        2: "已审核",
        3: "审核不通过",
        4: "外业验证",
        5: "鲜度验证",
    };

    var _conf_origin_prop = {
        "name": 1,
        "address": 1,
        "contacts": 1,
        "postCode": 1,
        "adminCode": 1,
        "kindCode": 1,
        "brands": 1,
        "level": 1,
        "open24H": 1,
        "relateParent": 1,
        "relateChildren": 1,
        "names": 1,
        "indoor": 1
    }
    var initOptionStyle = function(poiJson) {
        var editedProperty = new Object();
        var data = [];
        if (poiJson.lifecycle == 1) { //删除 
            if (poiJson.editHistory && poiJson.editHistory.length > 0) {
                var history = poiJson.editHistory[poiJson.editHistory.length - 1];
                if (history && history.mergeContents) {
                    var contents = history.mergeContents;
                    var temp, tt;
                    for (var i = 0, len = contents.length; i < len; i++) {
                        temp = FM.Util.stringToJson(contents[i].oldValue);
                        for (var kk in temp) {
                            tt = _conf_origin_prop[kk];
                            if (tt) {
                                editedProperty[kk] = kk;
                            }
                        }
                    }
                }
            }
        } else if (poiJson.qtLifecycle == 3) { //  新增
            if (poiJson.editHistory && poiJson.editHistory.length > 0) {
                var history = poiJson.editHistory[poiJson.editHistory.length - 1];
                if (history && history.mergeContents) {
                    var contents = history.mergeContents;
                    var temp, tt;
                    for (var i = 0, len = contents.length; i < len; i++) {
                        temp = FM.Util.stringToJson(contents[i].oldValue);
                        for (var kk in temp) {
                            tt = _conf_origin_prop[kk];
                            if (tt) {
                                editedProperty[kk] = kk;
                            }
                        }
                    }
                }
            }
        } else if (poiJson.lifecycle == 2) { // 修改
            if (poiJson.editHistory && poiJson.editHistory.length > 0) {
                var history = poiJson.editHistory[poiJson.editHistory.length - 1];
                if (history && history.mergeContents) {
                    var contents = history.mergeContents;
                    var temp;
                    for (var i = 0, len = contents.length; i < len; i++) {
                        temp = FM.Util.stringToJson(contents[i].oldValue);
                        for (var kk in temp) {
                            tt = _conf_origin_prop[kk];
                            if (tt) {
                                editedProperty[kk] = kk;
                            }
                        }
                    }
                }
            }
        }
        for (var t in editedProperty) {
            $scope[t + 'StyleFlag'] = true;
        }
    }

    var initBaseInfoIcon = function(icon, vipFlag) {
        $scope.poi3DIcon = icon;
        if (vipFlag) {
            var tmp = vipFlag.split("|");
            for (var i = 0; i < tmp.length; i++) {
                if (tmp[i] == 1) {
                    $scope.poiCarIcon = true;
                } else if (tmp[i] == 2) {
                    $("#poiCarIcon").show();
                    $scope.poiRmbIcon = true;
                }
            }
        }
    }

    var initKindBrandLevel = function(poi) {
        $scope.kindFormat = pKindFormat;

        $scope.directiveOptions = {
            no_results_text: "SO SORRY"
        };

        $scope.levelArr = []; //用于存放等级的数组
        var kind = pKindFormat[poi.kindCode]
        $scope.levelArr = kind.level.split("|");
    }
    //等级的默认选中
    $scope.isLevelSelected = function(val) {
        var kind = pKindFormat[$scope.selectedKind]
        if (kind && kind.level.split("|").length == 1){ //如果只有一个等级默认选中
            $scope.poi.level = val;
            return true;
        }else {
           return $scope.poi.level == val; 
        }
        
    }

    //改变等级
    $scope.updateLevelSelected = function(val) {
        $scope.poi.level = val;
    }

    $scope.ctrl = {
        openBase: true,
        openDeep:true,
        fieldLabel: {},
    };
    $scope.relateParent = {};
    $scope.switchLifeCycle = function(value) {
        var label = {
            1: 'danger',
            2: 'warning',
            3: 'success',
            4: 'default'
        };
        if (value != 1 && value != 2 && value != 3) {
            value = 4;
        }
        $scope.ctrl.lifeCycleName = lifecycle[value];
        $scope.ctrl.lifeCycleLabel = label[value];
    };

    $scope.switchRawFields = function(value) {
        var conf = {
            1: "name",
            2: "contacts",
            3: "kindCode",
            4: "brands",
            5: "address",
            6: "postCode",
            7: "deepInfo"
        }

        if (value) {
            var list = App.Util.split(value, "|");
            for (key in conf) {
                $scope.ctrl.fieldLabel[conf[key]] = (list.indexOf(key) >= 0);
            }
        }
    };
    /*  
        增加电话控件
    */
    $scope.addTelElem = function() {
        var contact = {
            type: 1,
            linkman: null,
            priority: 1,
            weChatUrl: null,
            numRre: regionCode,
            numSuf: ""
        }
        $scope.poi.contacts.push(new FM.dataApi.IxPoiContact(contact));
        resetBtnHeight();
    }

    var resetBtnHeight = function() {
        //计算按钮的高度
        var len = $scope.poi.contacts.length;
        var height = 30;
        if (len > 1) {
            height = len * 33;
        }
        $scope.addBtnHeight = height;
    }

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
    $scope.removeTelElem = function(index) {
        if ($scope.poi.contacts.length > 1) {
            $scope.poi.contacts.splice(index, 1);
            resetBtnHeight()
        }
    }

    $scope.checkTelNo = function(index) {
        var contact = $scope.poi.contacts[index]
        if (contact.numSuf && contact.numSuf.length == 11 && /^1/.test(contact.numSuf)) {
            contact.type = 2;//手机
        } else {
            if (contact.numSuf) {
                var p = contact.numSuf.split("-");
                if (p.length > 1) {
                    contact.numRre = p[0];
                    contact.numSuf = p[1];
                } else {
                    contact.numRre = regionCode;
                }
            }
        }
    }

    $scope.showEvalutePlanning = function() {
        if ($scope.poi.evaluatePlanning == 1 || $scope.poi.evaluatePlanning == 2) {
            return true;
        } else {
            return false
        }
    }

    $scope.kindChange = function(evt, obj) {
        $scope.poi.kindCode = obj.selectedKind; //会触发$scope.$watch('poi.kindCode'方法
        $scope.poi.brands[0].code = "";
        $scope.$emit("kindChange", pKindFormat[obj.selectedKind]);
    };
    $scope.brandChange = function (evt, sco) {
        $scope.poi.brands[0].code = sco.selectedChain;
        meta.getChainLevel($scope.poi.kindCode,sco.selectedChain).then(function (data){
            if (data) {
                $scope.levelArr = [];
                $scope.levelArr = data.split("|");
            }
        });
    };

    $scope.showChildrenPoisInMap = function() {
        $scope.$emit('emitChildren', {});
    };
    $scope.showParentPoiInMap = function() {
        $scope.$emit('emitParent', {});
    };

    //初始化时监听selectedKind,后续都是通过$scope.kindChange方法监听的
    $scope.$watch("selectedKind", function() {
        if ($scope.selectedKind && pKindFormat[$scope.selectedKind]) {
            $scope.$emit("kindChange", pKindFormat[$scope.selectedKind]);
        }
    });

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
                $scope.levelArr = [];
                if (level) {
                    $scope.levelArr = level.split("|");
                }
                break;
            }
        }
    });

    var initData = function (){
        $scope.poi = $scope.$parent.poi;
        pKindList = $scope.$parent.metaData.kindList;
        pKindFormat = $scope.$parent.metaData.kindFormat;
        pAllChain = $scope.$parent.metaData.allChain;
        $scope.switchLifeCycle($scope.poi.lifecycle);
        $scope.switchRawFields($scope.poi.rawFields);
        initBaseInfoIcon($scope.$parent.poiIcon, $scope.poi.vipFlag);
        initOptionStyle($scope.poi);
        initKindBrandLevel($scope.poi);
        //initRemark($scope.poi);
        resetBtnHeight();
    }

    initData();

    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "baseInfo");
    });
}]);
