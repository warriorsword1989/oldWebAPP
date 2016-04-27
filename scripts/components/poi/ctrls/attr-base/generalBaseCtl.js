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
    $scope.test = function() {
        console.log("base");
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
        var list = FM.Util.split(!value ? "" : value);
        for (key in conf) {
            $scope.ctrl.fieldLabel[conf[key]] = (list.indexOf(key) >= 0);
        }
    };
    $scope.kindChange = function(evt, obj) {
        // console.log(evt);
        // console.log(obj);
        // console.log(obj.selectedKind);
        console.log(obj.selectedKind);
        $scope.$emit("kindChange", obj.selectedKind);
    };
    // $scope.$on("initPage", function(event, data) {
    //     $scope.meta.kindList = data;
    // });
    // $scope.poi = $scope.poi;
    // $scope.poi.fid = "123";
    $scope.$watch('poi.kindCode', function() {
        for (var i = 0; i < $scope.meta.kindList.length; i++) {
            if ($scope.meta.kindList[i].kindCode == $scope.poi.kindCode) {
                $scope.selectedKind = $scope.meta.kindList[i];
            }
        }
        $scope.$emit("kindChange", $scope.selectedKind);
    });
    $scope.$on("loadup", function(event, data) {
        $scope.poi = data.getSnapShot();
        $scope.switchLifeCycle($scope.poi.lifecycle);
        $scope.switchRawFields($scope.poi.rawFields);
    });
    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "baseInfo");
    });
});