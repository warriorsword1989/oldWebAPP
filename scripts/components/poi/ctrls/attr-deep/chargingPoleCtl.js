angular.module('app').controller('chargingPoleCtl', function($scope) {
    $scope.ctrl = {
        open: true,
        btShow: true
    };
    // $scope.test = function() {
    //     console.log("parkings");
    // };
    $scope.changeOpenType = function(event) {
        if (event.target.value == "1") {
            if (event.target.checked) {
                for (var key in $scope.charging.openType) {
                    if (key != "1") {
                        $scope.charging.openType[key] = false;
                    }
                }
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
    // var test = $scope.poi;
    // $scope.test();
    // $scope.$on("loadup", function(event, data) {
    //     $scope.parkings = data.getSnapShot();
    //     $scope.parkings = {
    //         tollStd: "1|2|3",
    //         buildingType: 4,
    //     };
    //     $scope.initCheckbox($scope.parkings.tollStd, $scope.parkings.tollStdObj = {});
    // });
    $scope.$on("save", function(event, data) {
        $scope.$emit("saveMe", "deepInfo");
    });
});