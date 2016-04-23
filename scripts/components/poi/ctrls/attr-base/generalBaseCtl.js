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
    $scope.status = {
        open: true,
        fieldLabel: {},
    };
    $scope.switchLifeCycle = function(value) {
        var label = {
            1: 'danger',
            2: 'warning',
            3: 'success'
        };
        $scope.status.lifeCycleName = lifecycle[value];
        $scope.status.lifeCycleLabel = label[value];
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
            $scope.status.fieldLabel[conf[key]] = (list.indexOf(key) >= 0);
        }
    };
    $scope.$on("loadup", function(event, data) {
        $scope.poi = data.getSnapShot();
        $scope.switchLifeCycle($scope.poi.lifecycle);
        $scope.switchRawFields($scope.poi.rawFields);
    });
});