angular.module('app').controller('generalBaseCtl', function($scope,$timeout) {
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
    var initOptionStyle = function (poiJson){
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
        for (var t in editedProperty){
            $scope[t+'StyleFlag'] = true;
        }
    }

    var initBaseInfoIcon = function (icon , vipFlag){
        $scope.poi3DIcon = icon;
        if(vipFlag){
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

    var initLevel = function (poi){
        $scope.levelArr = [];
        if(poi.level){
            $scope.levelArr = poi.level.split("|");
        }
    }

    $scope.ctrl = {
        open: true,
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
        
        if(value){
            var list = App.Util.split(value,"|");
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
            number: "",
            type: 1,
            linkman: null,
            priority: 1,
            weChatUrl: null,
            numRre: regionCode,
            numSuf: "",
            flag: true //true 带区号的电话，false手机号码
        }
        $scope.poi.contacts.push(contact);
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

    $scope.removeTelElem = function(index) {
        if ($scope.poi.contacts.length > 1) {
            $scope.poi.contacts.splice(index, 1);
            resetBtnHeight()
        }
    }

    $scope.checkTelNo = function(index) {
        var contact = $scope.poi.contacts[index]
        if (contact.numSuf && contact.numSuf.length == 11 && /^1/.test(contact.numSuf)) {
            contact.number = contact.numSuf;
            contact.flag = false
        } else {
            contact.number = regionCode + contact.numSuf;
            contact.numRre = regionCode;
            contact.flag = true
        }
    }

    $scope.showEvalutePlanning = function (){
        if ($scope.poi.evaluatePlanning == 1 || $scope.poi.evaluatePlanning== 2){
            return true;
        }else {
            return false
        }
    }

    $scope.kindChange = function(evt, obj) {


        $scope.$emit("kindChange", obj.selectedKind);
    };
    $scope.showChildrenPoisInMap = function() {
        $scope.$emit('emitMainEditorTransChildren', {});
    };
    $scope.showParentPoiInMap = function() {
        $scope.$emit('emitMainEditorTransParent', {});
    };
    //初始化时让品牌默认选中
    $scope.$watch('poi.kindCode', function() {
        // for (var i = 0; i < $scope.meta.kindList.length; i++) {
        //     if ($scope.meta.kindList[i].kindCode == $scope.poi.kindCode) {
        //         $scope.selectedKind = $scope.meta.kindList[i];
        //         break;
        //     }
        // }
        for (var i = 0; i < $scope.kindList.length; i++) {
            if ($scope.kindList[i].value == $scope.poi.kindCode) {
                $scope.selectedKind = $scope.kindList[i];
                break;
            }
        }
    });


    $scope.$on("loadup", function(event, data) {
        $scope.poi = data.poi;
        $scope.kindList = data.kindList;
        $scope.switchLifeCycle($scope.poi.lifecycle);
        $scope.switchRawFields($scope.poi.rawFields);
        initBaseInfoIcon(data.poiIcon,$scope.poi.vipFlag);
        initOptionStyle($scope.poi);
        //initKindCode($scope.poi);
        initLevel($scope.poi);
        resetBtnHeight();
    });

    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "baseInfo");
    });
});
