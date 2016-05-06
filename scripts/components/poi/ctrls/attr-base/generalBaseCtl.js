angular.module('app').controller('generalBaseCtl', function($scope) {
    var lifecycle = {
        1: "删 除",
        2: "修 改",
        3: "新 增"
    };
    var auditStatus = {
        1: "待审核",
        2: "已审核",
    };
    $scope.ctrl = {
        open: true,
        fieldLabel: {},
    };
    $scope.relateParent = {
    };
    $scope.switchLifeCycle = function(value) {
        var label = {
            1: 'danger',
            2: 'warning',
            3: 'success'
        };
        $scope.ctrl.lifeCycleName = lifecycle[value];
        $scope.ctrl.lifeCycleLabel = label[value];
    };
    $scope.switchRawFields = function(value) {
        var conf = {
            1: "name",
            2: "telephone",
            3: "kindCode",
            4: "brands",
            5: "address",
            6: "postCode",
            7: "deepInfo"
        }
        var list = App.Util.split(!value ? "" : value);
        for (key in conf) {
            $scope.ctrl.fieldLabel[conf[key]] = (list.indexOf(key) >= 0);
        }
    };
    /*  
        增加电话控件
    */
    $scope.addTelElem = function (){
        var contact = {
            number : "",
            type : 1,
            linkman : null,
            priority : 1,
            weChatUrl : null,
            numRre : "",
            numSuf : "",
            flag : true
        }
        $scope.poi.contacts.push(contact);
        resetBtnHeight();
    }

    var resetBtnHeight = function (){
        //计算按钮的高度
        var len = $scope.poi.contacts.length;
        var height= 30;
        if (len > 1) {
            height = len * 33;
        }
        $scope.addBtnHeight = height;
    }

    $scope.removeTelElem = function (index){
        $scope.poi.contacts.splice(index,1);
        resetBtnHeight()
    }

    $scope.kindChange = function(evt, obj) {
        $scope.$emit("kindChange", obj.selectedKind);
    };
    $scope.showChildrenPoisInMap = function() {
        $scope.$emit('showChildrenPoisInMap',{});
    };
    $scope.showParentPoiInMap = function() {
        $scope.$emit('showParentPoiInMap',{});
    };

    $scope.$watch('poi.kindCode', function() {
        for (var i = 0; i < $scope.meta.kindList.length; i++) {
            if ($scope.meta.kindList[i].kindCode == $scope.poi.kindCode) {
                $scope.selectedKind = $scope.meta.kindList[i];
                break;
            }
        }
        //$scope.$emit("kindChange", $scope.selectedKind);
    });
    $scope.$on("loadup", function(event, data) {
        //$scope.poi = data.getSnapShot();
        $scope.poi = data.getBaseInfo();
        $scope.switchLifeCycle($scope.poi.lifecycle);
        $scope.switchRawFields($scope.poi.rawFields);        
        resetBtnHeight();
    });
    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "baseInfo");
    });
});